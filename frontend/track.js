(function () {
  const user_id = window.__OFFERWALL_USER_ID__ || "anonymous";
  const campaign_id = window.__OFFERWALL_CAMPAIGN_ID__;
  if (!campaign_id) {
    console.warn("[오퍼월] 캠페인 ID가 설정되지 않았습니다.");
    return;
  }

  fetch("http://localhost:5000/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id,
      campaign_id,
      event: "visit_valid"
    })
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("[오퍼월] 트래킹 성공:", data);
    })
    .catch((err) => {
      console.error("[오퍼월] 트래킹 실패:", err);
    });
})();
