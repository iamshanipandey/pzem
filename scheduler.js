const CONTROL_API = "https://pzem.onrender.com/proxy/control";


async function hitRelayAPI(action) {
  try {
        const res = await fetch(CONTROL_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ relay: action }),
    });

    if (!res.ok) throw new Error("API call failed");
    const data = await res.json();
    console.log(data);
    console.log("✅ Relay Updated:", data);

    document.getElementById("scheduleStatus").innerText =
      `✅ Relay turned ${action} at ${new Date().toLocaleTimeString()}`;
  } catch (err) {
    console.error(err);
    document.getElementById("scheduleStatus").innerText = "❌ Failed to hit API";
  }
}

document.getElementById("scheduleBtn").addEventListener("click", () => {
  const action = document.getElementById("relayAction").value;
  const dateTime = document.getElementById("scheduleTime").value;
  const countdown = document.getElementById("countdown").value;

  let delay = null;

  if (dateTime) {
    const targetTime = new Date(dateTime).getTime();
    delay = targetTime - Date.now();
  } else if (countdown) {
    delay = countdown * 60 * 1000;
  }

  if (delay <= 0) {
    alert("Please select a valid future time or countdown.");
    return;
  }

  const formattedDelay =
    delay >= 3600000
      ? `${(delay / 3600000).toFixed(1)} hour(s)`
      : `${(delay / 60000).toFixed(0)} minute(s)`;

  document.getElementById("scheduleStatus").innerText =
    `⏳ Scheduled to turn ${action} in ${formattedDelay}...`;

  setTimeout(() => {
    hitRelayAPI(action);
  }, delay);
});
