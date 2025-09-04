let sources = JSON.parse(localStorage.getItem("sources")) || [];
let logs = JSON.parse(localStorage.getItem("logs")) || [];

const sourceForm = document.getElementById("sourceForm");
const logForm = document.getElementById("logForm");
const sourceList = document.getElementById("sourceList");
const logSource = document.getElementById("logSource");
const ctx = document.getElementById("storageChart").getContext("2d");

function saveData() {
  localStorage.setItem("sources", JSON.stringify(sources));
  localStorage.setItem("logs", JSON.stringify(logs));
}

function renderSources() {
  sourceList.innerHTML = "";
  logSource.innerHTML = "<option value=''>Select Source</option>";
  sources.forEach((s, idx) => {
    const li = document.createElement("li");
    li.textContent = `${s.name} - Capacity: ${s.capacity} m³, Initial: ${s.initialStorage} m³`;
    sourceList.appendChild(li);

    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = s.name;
    logSource.appendChild(opt);
  });
}

function renderChart() {
  const labels = [];
  const data = [];
  logs.forEach(log => {
    labels.push(log.date);
    let balance = log.inflow + (log.rainfall * 10) - log.outflow - log.demand;
    data.push(balance);
  });

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "Storage Balance (m³)",
        data: data,
        borderColor: "#0077cc",
        fill: false
      }]
    }
  });
}

sourceForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("sourceName").value;
  const capacity = parseFloat(document.getElementById("capacity").value);
  const initialStorage = parseFloat(document.getElementById("initialStorage").value);

  sources.push({ name, capacity, initialStorage });
  saveData();
  renderSources();
  sourceForm.reset();
});

logForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const sourceIdx = logSource.value;
  const date = document.getElementById("date").value;
  const inflow = parseFloat(document.getElementById("inflow").value);
  const rainfall = parseFloat(document.getElementById("rainfall").value);
  const outflow = parseFloat(document.getElementById("outflow").value);
  const demand = parseFloat(document.getElementById("demand").value);

  logs.push({ sourceIdx, date, inflow, rainfall, outflow, demand });
  saveData();
  renderChart();
  logForm.reset();
});

// Init
renderSources();
renderChart();