document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("trackForm");
  const userIdInput = document.getElementById("userIdInput");
  const campaignIdInput = document.getElementById("campaignIdInput");
  const resultText = document.getElementById("resultText");
  const autoBtn = document.getElementById("autoTrackBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userIdInput.value,
        campaign_id: parseInt(campaignIdInput.value),
        event: "visit_valid"
      })
    });

    const data = await res.json();
    resultText.textContent = res.ok ? `✅ 트래킹 성공! log_id=${data.log_id}` : `❌ 오류: ${data.error}`;
  });

  autoBtn.addEventListener("click", () => {
    window.__OFFERWALL_USER_ID__ = userIdInput.value;
    window.__OFFERWALL_CAMPAIGN_ID__ = parseInt(campaignIdInput.value);
    const script = document.createElement("script");
    script.src = "track.js";
    document.body.appendChild(script);
  });
});
