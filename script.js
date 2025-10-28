const API_URL = "http://localhost:5000/api/dashboard";
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

    // Update text values
    document.getElementById("voltage").innerText = data.voltage ?? "--";
    document.getElementById("current").innerText = data.current ?? "--";
    document.getElementById("power").innerText = data.power ?? "--";
    document.getElementById("energy").innerText = data.energy ?? "--";
    document.getElementById("pf").innerText = data.pf ?? "--";
    document.getElementById("frequency").innerText = data.frequency ?? "--";
    document.getElementById("relay").innerText = data.relay ?? "--";

    document.getElementById("status").innerText =
      "✅ Live updating... " + new Date().toLocaleTimeString();

    // Extract voltage as number
    let voltageValue = parseFloat(String(data.voltage).replace(/[^\d.]/g, "")) || 0;
    updateChart(voltageValue);

  } catch (err) {
    console.error("Error fetching dashboard:", err);
    document.getElementById("status").innerText = "❌ Error fetching data";
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
    intervalId = setInterval(fetchDashboard, 5000);
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
