document.addEventListener("DOMContentLoaded", async () => {
  const table = document.getElementById("campaignTable");

  const [campaignsRes, logsRes, rewardsRes] = await Promise.all([
    fetch("http://localhost:5000/campaigns"),
    fetch("http://localhost:5000/logs"),
    fetch("http://localhost:5000/rewards")
  ]);

  const campaigns = await campaignsRes.json();
  const logs = await logsRes.json();
  const rewards = await rewardsRes.json();

  campaigns.forEach(c => {
    const campaignLogs = logs.filter(l => l.campaign_id === c.id);
    const paidRewards = rewards.filter(r => {
      const log = logs.find(l => l.id === r.log_id);
      return log && log.campaign_id === c.id && r.status === "paid";
    });

    const status =
      paidRewards.length >= c.quantity ? "완료" : "진행 중";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.id}</td>
      <td>${c.user_id}</td>
      <td><a href="${c.link}" target="_blank">🔗</a></td>
      <td>${c.quantity}</td>
      <td>${campaignLogs.length}</td>
      <td>${paidRewards.length}</td>
      <td>${status}</td>
    `;
    table.appendChild(row);
  });
});
