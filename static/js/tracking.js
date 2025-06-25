// ✅ 키워드 수집 및 유입 트래킹 스크립트
function trackVisit({ user_id, campaign_id }) {
  const keyword = extractKeywordFromReferrer(document.referrer);

  const payload = {
    user_id,
    campaign_id,
    event: "visit_valid",
    timestamp: new Date().toISOString(),
    referrer: document.referrer,
    device: getDeviceType(),
    user_agent: navigator.userAgent,
    language: navigator.language,
    screen: `${window.screen.width}x${window.screen.height}`,
    keyword: keyword
  };

  fetch("/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error("트래킹 실패");
      return res.json();
    })
    .then(data => {
      console.log("✅ 유입 트래킹 성공:", data);

      if (data.reward?.status === "paid") {
        alert(`🎉 ${data.reward.description}이/가 지급되었습니다!`);
        // 또는 페이지에 보상 UI 삽입
        document.getElementById("rewardNotice").innerHTML = `
          <div class="alert alert-success mt-3">
            ${data.reward.description} 지급 완료! (${new Date(data.reward.paid_at).toLocaleString()})
          </div>
        `;
      }
    })
    .catch(err => {
      console.error("❌ 유입 트래킹 실패:", err);
    });
}

// ✅ URL 쿼리 파라미터 추출
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// ✅ referrer 에서 키워드 추출 (검색엔진별 대응)
function extractKeywordFromReferrer(referrer) {
  try {
    const url = new URL(referrer);
    const params = new URLSearchParams(url.search);
    const raw =
      params.get("query") ||   // Naver
      params.get("q") ||       // Google
      params.get("p") ||       // Yahoo
      null;
    return raw ? decodeURIComponent(raw) : null;
  } catch {
    return null;
  }
}

// ✅ 디바이스 OS 추출
function getDeviceType() {
  const ua = navigator.userAgent.toLowerCase();

  if (ua.includes("windows")) return "Windows";
  if (ua.includes("macintosh") || ua.includes("mac os")) return "macOS";
  if (ua.includes("android")) return "Android";
  if (ua.includes("iphone")) return "iPhone";
  if (ua.includes("ipad")) return "iPad";
  if (ua.includes("linux")) return "Linux";
  if (ua.includes("cros")) return "Chrome OS";

  return "Unknown";
}