// Enhanced Water Resource Management System
// Version 2.0 with Analytics, Alerts, and Export Features

class WaterResourceManager {
    constructor() {
        this.sources = JSON.parse(localStorage.getItem("sources")) || [];
        this.logs = JSON.parse(localStorage.getItem("logs")) || [];
        this.settings = JSON.parse(localStorage.getItem("settings")) || this.getDefaultSettings();
        this.chart = null;
        this.init();
    }

    getDefaultSettings() {
        return {
            alertThresholds: {
                lowStorage: 20, // percentage
                highDemand: 80,  // percentage of capacity
                excessiveRainfall: 50 // mm
            },
            units: {
                volume: 'm³',
                rainfall: 'mm'
            },
            chartColors: {
                primary: '#0077cc',
                secondary: '#28a745',
                warning: '#ffc107',
                danger: '#dc3545'
            }
        };
    }

    init() {
        this.bindEvents();
        this.renderSources();
        this.renderChart();
        this.updateStatistics();
        this.checkAlerts();
    }

    bindEvents() {
        // Form submissions
        document.getElementById("sourceForm").addEventListener("submit", (e) => this.addSource(e));
        document.getElementById("logForm").addEventListener("submit", (e) => this.addLog(e));

        // New feature buttons
        document.getElementById("exportData")?.addEventListener("click", () => this.exportData());
        document.getElementById("importData")?.addEventListener("click", () => this.importData());
        document.getElementById("clearData")?.addEventListener("click", () => this.clearAllData());
        document.getElementById("generateReport")?.addEventListener("click", () => this.generateReport());

        // Settings
        document.getElementById("settingsForm")?.addEventListener("submit", (e) => this.updateSettings(e));
    }

    saveData() {
        localStorage.setItem("sources", JSON.stringify(this.sources));
        localStorage.setItem("logs", JSON.stringify(this.logs));
        localStorage.setItem("settings", JSON.stringify(this.settings));
    }

    addSource(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const source = {
            id: Date.now(),
            name: formData.get('sourceName'),
            capacity: parseFloat(formData.get('capacity')),
            initialStorage: parseFloat(formData.get('initialStorage')),
            location: formData.get('location') || '',
            type: formData.get('sourceType') || 'reservoir',
            createdAt: new Date().toISOString()
        };

        // Validation
        if (source.initialStorage > source.capacity) {
            this.showAlert('Initial storage cannot exceed capacity!', 'danger');
            return;
        }

        this.sources.push(source);
        this.saveData();
        this.renderSources();
        this.updateStatistics();
        this.showAlert(`Source "${source.name}" added successfully!`, 'success');
        e.target.reset();
    }

    addLog(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const log = {
            id: Date.now(),
            sourceIdx: parseInt(formData.get('logSource')),
            date: formData.get('date'),
            inflow: parseFloat(formData.get('inflow')),
            rainfall: parseFloat(formData.get('rainfall')),
            outflow: parseFloat(formData.get('outflow')),
            demand: parseFloat(formData.get('demand')),
            notes: formData.get('notes') || '',
            createdAt: new Date().toISOString()
        };

        // Calculate storage balance
        log.balance = log.inflow + (log.rainfall * 10) - log.outflow - log.demand;

        this.logs.push(log);
        this.saveData();
        this.renderChart();
        this.updateStatistics();
        this.checkAlerts();
        this.showAlert('Daily data logged successfully!', 'success');
        e.target.reset();
    }

    renderSources() {
        const sourceList = document.getElementById("sourceList");
        const logSource = document.getElementById("logSource");

        if (!sourceList || !logSource) return;

        sourceList.innerHTML = "";
        logSource.innerHTML = "<option value=''>Select Source</option>";

        if (this.sources.length === 0) {
            sourceList.innerHTML = "<li class='no-sources'>No water sources added yet. Add your first source above!</li>";
            return;
        }

        this.sources.forEach((source, idx) => {
            // Enhanced source display
            const li = document.createElement("li");
            li.className = "source-item";

            const currentStorage = this.getCurrentStorage(idx);
            const storagePercentage = (currentStorage / source.capacity * 100).toFixed(1);

            li.innerHTML = `
                <div class="source-header">
                    <strong>${source.name}</strong>
                    <span class="source-type">${source.type}</span>
                </div>
                <div class="source-details">
                    <span>Capacity: ${source.capacity} ${this.settings.units.volume}</span>
                    <span>Current: ${currentStorage.toFixed(1)} ${this.settings.units.volume} (${storagePercentage}%)</span>
                    ${source.location ? `<span>Location: ${source.location}</span>` : ''}
                </div>
                <div class="source-actions">
                    <button onclick="waterManager.deleteSource(${idx})" class="btn-danger btn-sm">Delete</button>
                    <button onclick="waterManager.editSource(${idx})" class="btn-secondary btn-sm">Edit</button>
                </div>
            `;
            sourceList.appendChild(li);

            // Add to select dropdown
            const opt = document.createElement("option");
            opt.value = idx;
            opt.textContent = source.name;
            logSource.appendChild(opt);
        });
    }

    getCurrentStorage(sourceIdx) {
        const source = this.sources[sourceIdx];
        if (!source) return 0;

        let currentStorage = source.initialStorage;
        const sourceLogs = this.logs.filter(log => log.sourceIdx === sourceIdx);

        sourceLogs.forEach(log => {
            currentStorage += log.balance;
        });

        return Math.max(0, Math.min(currentStorage, source.capacity));
    }

    renderChart() {
        const ctx = document.getElementById("storageChart")?.getContext("2d");
        if (!ctx) return;

        if (this.chart) {
            this.chart.destroy();
        }

        if (this.sources.length === 0 || this.logs.length === 0) {
            // Show empty chart message
            return;
        }

        const datasets = this.sources.map((source, idx) => {
            const data = [];
            const labels = [];
            let currentStorage = source.initialStorage;

            const sourceLogs = this.logs
                .filter(log => log.sourceIdx === idx)
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            // Add initial point
            if (sourceLogs.length > 0) {
                labels.push(sourceLogs[0].date);
                data.push(currentStorage);
            }

            sourceLogs.forEach(log => {
                currentStorage += log.balance;
                currentStorage = Math.max(0, Math.min(currentStorage, source.capacity));
                data.push(currentStorage);
                labels.push(log.date);
            });

            return {
                label: source.name,
                data: data,
                borderColor: this.getColorForIndex(idx),
                backgroundColor: this.getColorForIndex(idx, 0.1),
                fill: false,
                tension: 0.1
            };
        });

        const allLabels = [...new Set(this.logs.map(log => log.date))].sort();

        this.chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: allLabels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Water Storage Levels Over Time'
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: `Storage (${this.settings.units.volume})`
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    }

    updateStatistics() {
        const stats = this.calculateStatistics();
        this.renderStatistics(stats);
    }

    calculateStatistics() {
        const totalCapacity = this.sources.reduce((sum, source) => sum + source.capacity, 0);
        const currentStorage = this.sources.reduce((sum, source, idx) => sum + this.getCurrentStorage(idx), 0);
        const utilizationRate = totalCapacity > 0 ? (currentStorage / totalCapacity * 100) : 0;

        const recentLogs = this.logs.slice(-30); // Last 30 logs
        const avgInflow = recentLogs.reduce((sum, log) => sum + log.inflow, 0) / (recentLogs.length || 1);
        const avgOutflow = recentLogs.reduce((sum, log) => sum + log.outflow, 0) / (recentLogs.length || 1);
        const avgRainfall = recentLogs.reduce((sum, log) => sum + log.rainfall, 0) / (recentLogs.length || 1);

        return {
            totalCapacity,
            currentStorage,
            utilizationRate,
            avgInflow,
            avgOutflow,
            avgRainfall,
            totalSources: this.sources.length,
            totalLogs: this.logs.length
        };
    }

    renderStatistics(stats) {
        const statsContainer = document.getElementById("statisticsContainer");
        if (!statsContainer) return;

        const statsGrid = statsContainer.querySelector('.stats-grid');
        if (statsGrid) {
            statsGrid.innerHTML = `
                <div class="stat-card">
                    <div class="stat-number">${stats.totalSources}</div>
                    <div class="stat-label">Water Sources</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.currentStorage.toFixed(1)}</div>
                    <div class="stat-label">Current Storage (${this.settings.units.volume})</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.utilizationRate.toFixed(1)}%</div>
                    <div class="stat-label">Utilization Rate</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.avgInflow.toFixed(1)}</div>
                    <div class="stat-label">Avg Inflow (${this.settings.units.volume})</div>
                </div>
            `;
        }
    }

    checkAlerts() {
        const alerts = [];

        this.sources.forEach((source, idx) => {
            const currentStorage = this.getCurrentStorage(idx);
            const storagePercentage = (currentStorage / source.capacity) * 100;

            if (storagePercentage < this.settings.alertThresholds.lowStorage) {
                alerts.push({
                    type: 'warning',
                    message: `Low storage alert: ${source.name} is at ${storagePercentage.toFixed(1)}%`
                });
            }
        });

        // Check for excessive rainfall in recent logs
        const recentLogs = this.logs.slice(-7); // Last 7 logs
        recentLogs.forEach(log => {
            if (log.rainfall > this.settings.alertThresholds.excessiveRainfall) {
                alerts.push({
                    type: 'info',
                    message: `High rainfall recorded: ${log.rainfall}mm on ${log.date}`
                });
            }
        });

        this.renderAlerts(alerts);
    }

    renderAlerts(alerts) {
        const alertContainer = document.getElementById("alertContainer");
        if (!alertContainer) return;

        if (alerts.length === 0) {
            alertContainer.innerHTML = '<div class="alert alert-info">System ready - no alerts at this time.</div>';
        } else {
            alertContainer.innerHTML = alerts.map(alert => 
                `<div class="alert alert-${alert.type}">${alert.message}</div>`
            ).join('');
        }
    }

    showAlert(message, type = 'info') {
        // Create temporary alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '20px';
        alertDiv.style.right = '20px';
        alertDiv.style.zIndex = '1000';
        alertDiv.style.minWidth = '300px';
        alertDiv.textContent = message;

        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }

    exportData() {
        const data = {
            sources: this.sources,
            logs: this.logs,
            settings: this.settings,
            exportDate: new Date().toISOString(),
            version: "2.0.0"
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `water-resource-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        this.showAlert('Data exported successfully!', 'success');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);

                    if (data.sources && data.logs) {
                        this.sources = data.sources;
                        this.logs = data.logs;
                        if (data.settings) this.settings = data.settings;

                        this.saveData();
                        this.init();
                        this.showAlert('Data imported successfully!', 'success');
                    } else {
                        throw new Error('Invalid file format');
                    }
                } catch (error) {
                    this.showAlert('Error importing data: ' + error.message, 'danger');
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            this.sources = [];
            this.logs = [];
            localStorage.clear();
            this.init();
            this.showAlert('All data cleared!', 'info');
        }
    }

    generateReport() {
        const stats = this.calculateStatistics();
        const reportDate = new Date().toLocaleDateString();

        const reportContent = `# Water Resource Management Report
Generated on: ${reportDate}

## Summary Statistics
- Total Water Sources: ${stats.totalSources}
- Total Storage Capacity: ${stats.totalCapacity} ${this.settings.units.volume}
- Current Storage: ${stats.currentStorage.toFixed(1)} ${this.settings.units.volume}
- Utilization Rate: ${stats.utilizationRate.toFixed(1)}%

## Average Daily Metrics (Last 30 entries)
- Average Inflow: ${stats.avgInflow.toFixed(1)} ${this.settings.units.volume}
- Average Outflow: ${stats.avgOutflow.toFixed(1)} ${this.settings.units.volume}
- Average Rainfall: ${stats.avgRainfall.toFixed(1)} ${this.settings.units.rainfall}

## Water Sources Details
${this.sources.map((source, idx) => `
### ${source.name}
- Type: ${source.type}
- Capacity: ${source.capacity} ${this.settings.units.volume}
- Current Storage: ${this.getCurrentStorage(idx).toFixed(1)} ${this.settings.units.volume}
- Location: ${source.location || 'Not specified'}
`).join('')}

## Recent Activity
Total Logs: ${stats.totalLogs}
        `;

        const blob = new Blob([reportContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `water-resource-report-${new Date().toISOString().split('T')[0]}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
        this.showAlert('Report generated successfully!', 'success');
    }

    getColorForIndex(index) {
        const colors = [
            '#0077cc', '#28a745', '#ffc107', '#dc3545', 
            '#6f42c1', '#20c997', '#fd7e14', '#e83e8c'
        ];
        return colors[index % colors.length];
    }

    deleteSource(index) {
        if (confirm(`Are you sure you want to delete "${this.sources[index].name}"?`)) {
            this.sources.splice(index, 1);
            // Remove logs for this source
            this.logs = this.logs.filter(log => log.sourceIdx !== index);
            // Update remaining log indices
            this.logs.forEach(log => {
                if (log.sourceIdx > index) log.sourceIdx--;
            });

            this.saveData();
            this.init();
            this.showAlert('Source deleted successfully!', 'info');
        }
    }

    editSource(index) {
        // Simple edit - could be enhanced with a modal
        const source = this.sources[index];
        const newName = prompt('Enter new name:', source.name);
        const newCapacity = prompt('Enter new capacity:', source.capacity);

        if (newName && newCapacity) {
            source.name = newName;
            source.capacity = parseFloat(newCapacity);
            this.saveData();
            this.init();
            this.showAlert('Source updated successfully!', 'success');
        }
    }

    updateSettings(e) {
        e.preventDefault();
        const formData = new FormData(e.target);

        this.settings.alertThresholds.lowStorage = parseInt(formData.get('lowStorageThreshold'));
        this.settings.alertThresholds.excessiveRainfall = parseInt(formData.get('excessRainfallThreshold'));
        this.settings.units.volume = formData.get('volumeUnit');
        this.settings.units.rainfall = formData.get('rainfallUnit');

        this.saveData();
        this.init();
        this.showAlert('Settings saved successfully!', 'success');
    }
}

// Initialize the application
let waterManager;
document.addEventListener('DOMContentLoaded', () => {
    waterManager = new WaterResourceManager();

    // Set today's date as default
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
});