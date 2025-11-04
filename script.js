const API_URL = "https://pzem.onrender.com/api/dashboard";
const RELAY_URL = "https://pzem.onrender.com/api/relayStatus";
let intervalId = null;
let isRunning = false;

// Chart.js setup
const ctx = document.getElementById("voltageChart").getContext("2d");
const voltageChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Voltage (V)",
        data: [],
        borderColor: "#007bff",
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "#007bff"
      },
    ],
  },
  options: {
    scales: {
      x: { title: { display: true, text: "Time" } },
      y: {
        title: { display: true, text: "Voltage" },
        beginAtZero: true
      },
    },
  },
});

async function fetchDashboard() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();

    // Update all sensor readings
    document.getElementById("voltage").innerText = data.voltage ?? "--";
    document.getElementById("current").innerText = data.current ?? "--";
    document.getElementById("power").innerText = data.power ?? "--";
    document.getElementById("energy").innerText = data.energy ?? "--";
    document.getElementById("pf").innerText = data.pf ?? "--";
    document.getElementById("frequency").innerText = data.frequency ?? "--";

    // Relay: fetched separately from control API
    fetchRelayStatus();

    document.getElementById("status").innerText =
      "✅ Live updating... " + new Date().toLocaleTimeString();

    // Update voltage graph
    let voltageValue = parseFloat(String(data.voltage).replace(/[^\d.]/g, "")) || 0;
    updateChart(voltageValue);

  } catch (err) {
    console.error("Error fetching dashboard:", err);
    document.getElementById("status").innerText = "❌ Error fetching data";
  }
}

async function fetchRelayStatus() {
  try {
    const res = await fetch(RELAY_URL);
    if (!res.ok) throw new Error("Failed to fetch relay");
    const data = await res.json();

    document.getElementById("relay").innerText = data.relay ?? "--";
  } catch (err) {
    console.error("Error fetching relay:", err);
  }
}

function updateChart(value) {
  const now = new Date().toLocaleTimeString();
  voltageChart.data.labels.push(now);
  voltageChart.data.datasets[0].data.push(value);

  if (voltageChart.data.labels.length > 10) {
    voltageChart.data.labels.shift();
    voltageChart.data.datasets[0].data.shift();
  }

  voltageChart.update();
}

document.getElementById("toggleBtn").addEventListener("click", () => {
  const btn = document.getElementById("toggleBtn");

  if (!isRunning) {
    fetchDashboard();
    intervalId = setInterval(fetchDashboard, 10000);
    isRunning = true;
    btn.textContent = "⏸ Stop Live";
    btn.classList.add("stop");
    document.getElementById("status").innerText =
      "✅ Live started " + new Date().toLocaleTimeString();
  } else {
    clearInterval(intervalId);
    isRunning = false;
    btn.textContent = "▶ Start Live";
    btn.classList.remove("stop");
    document.getElementById("status").innerText =
      "⏹ Live stopped " + new Date().toLocaleTimeString();
  }
});
