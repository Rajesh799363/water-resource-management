const API_URL = "http://127.0.0.1:5000";

document.getElementById("dataForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    inflow: parseFloat(document.getElementById("inflow").value),
    rainfall: parseFloat(document.getElementById("rainfall").value),
    outflow: parseFloat(document.getElementById("outflow").value),
    demand: parseFloat(document.getElementById("demand").value),
    date: document.getElementById("date").value,
  };
  await fetch(`${API_URL}/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  fetchData();
});

async function fetchData() {
  const res = await fetch(`${API_URL}/data`);
  const data = await res.json();
  const tbody = document.querySelector("#dataTable tbody");
  tbody.innerHTML = "";
  data.forEach(row => {
    tbody.innerHTML += `<tr>
      <td>${row.id}</td>
      <td>${row.inflow}</td>
      <td>${row.rainfall}</td>
      <td>${row.outflow}</td>
      <td>${row.demand}</td>
      <td>${row.date}</td>
    </tr>`;
  });
}

async function trainModel() {
  await fetch(`${API_URL}/train`, { method: "POST" });
  alert("Model trained successfully!");
}

document.getElementById("predictForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    inflow: parseFloat(document.getElementById("pinflow").value),
    rainfall: parseFloat(document.getElementById("prainfall").value),
    outflow: parseFloat(document.getElementById("poutflow").value),
  };
  const res = await fetch(`${API_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  document.getElementById("predictionResult").innerText = 
    "Predicted Demand: " + result.predicted_demand.toFixed(2);
});
