# User Guide - Water Resource Management System

Welcome! This guide will help you use all features of the Water Resource Management System.

## Getting Started

1. **Open the Application**: Open `enhanced-index.html` in your browser
2. **Add Your First Source**: Use the "Add Water Source" form
3. **Log Daily Data**: Enter measurements for your sources
4. **Explore Features**: Try charts, alerts, and data management

## Adding Water Sources

### Required Fields
- **Source Name**: Unique identifier (e.g., "Main Reservoir")
- **Source Type**: Choose from dropdown (Reservoir, Lake, River, etc.)
- **Capacity**: Maximum storage in cubic meters
- **Initial Storage**: Current water level

### Optional Fields
- **Location**: Geographical information

### Tips
- Use descriptive names for easy identification
- Ensure initial storage doesn't exceed capacity
- Consider grouping related sources by location

## Logging Daily Data

### Data Fields
- **Source**: Select from your created sources
- **Date**: Entry date (defaults to today)
- **Inflow**: Water entering the source (m³)
- **Rainfall**: Precipitation amount (mm)
- **Outflow**: Water leaving the source (m³)
- **Demand**: Water consumption (m³)
- **Notes**: Optional observations

### Storage Calculation
The system calculates: `New Storage = Previous + Inflow + (Rainfall × 10) - Outflow - Demand`

*Note: Rainfall is multiplied by 10 to approximate volume contribution*

## Understanding Analytics

### Dashboard Stats
- **Total Sources**: Number of monitored sources
- **Current Storage**: Total water across all sources
- **Utilization Rate**: Percentage of total capacity used
- **Average Inflow**: Mean inflow over recent entries

### Chart Features
- **Multi-Source**: Each source has its own colored line
- **Interactive**: Hover for exact values
- **Time-based**: Shows trends over time
- **Responsive**: Adapts to screen size

## Alert System

### Alert Types
- **Low Storage**: When storage falls below threshold (default: 20%)
- **High Rainfall**: When rainfall exceeds limit (default: 50mm)
- **System Messages**: Success/error notifications

### Customizing Alerts
1. Go to "System Settings"
2. Adjust thresholds
3. Click "Save Settings"
4. New thresholds apply immediately

## Data Management

### Export Data
- Click "Export Data" button
- Downloads JSON file with all data
- Use for backup or sharing between devices

### Import Data
- Click "Import Data" button
- Select previously exported JSON file
- Replaces current data (backup first!)

### Generate Report
- Click "Generate Report" button
- Downloads Markdown report with statistics
- Includes source details and recent activity

### Clear All Data
- Click "Clear All Data" button
- Requires confirmation (cannot be undone)
- Removes all sources and logs

## Settings & Configuration

### Available Settings
- **Low Storage Alert**: Percentage threshold for warnings
- **High Rainfall Alert**: Rainfall limit for notifications
- **Volume Unit**: Display unit for water volumes
- **Rainfall Unit**: Display unit for precipitation

### Saving Settings
- Make changes in "System Settings" section
- Click "Save Settings"
- Changes take effect immediately

## Troubleshooting

### Common Issues

**Charts not showing:**
- Check internet connection (Chart.js from CDN)
- Refresh the page
- Clear browser cache

**Data not saving:**
- Enable localStorage in browser settings
- Check available storage space
- Try incognito/private mode

**Import/export problems:**
- Verify JSON file format
- Check file size limits
- Try with smaller dataset first

### Browser Compatibility
- **Recommended**: Chrome, Firefox, Safari, Edge
- **Not Supported**: Internet Explorer
- **Mobile**: Fully responsive design

### Performance Tips
- Keep under 10,000 log entries for best performance
- Export data regularly as backups
- Close unused browser tabs
- Clear cache occasionally

## Best Practices

### Data Quality
- **Accuracy**: Double-check measurements
- **Consistency**: Use same methods and timing
- **Completeness**: Fill all required fields

### Workflow
- **Daily Entry**: Log data consistently
- **Regular Reviews**: Check charts weekly
- **Backup**: Export data monthly

### Advanced Usage
- **Multi-Device**: Use export/import to sync
- **Analysis**: Generate regular reports
- **Planning**: Use trends for future planning

## Getting Help

1. Check this user guide first
2. Review README.md for technical details
3. Look at browser console for errors (F12)
4. Try different browser if issues persist

---

For technical details, see README.md. For version history, check CHANGELOG.md.