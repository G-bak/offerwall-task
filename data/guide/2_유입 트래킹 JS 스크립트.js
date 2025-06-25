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
    })
    .catch(err => {
      console.error("❌ 유입 트래킹 실패:", err);
    });
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function extractKeywordFromReferrer(referrer) {
  try {
    const url = new URL(referrer);
    const params = new URLSearchParams(url.search);
    const raw =
      params.get("query") ||  
      params.get("q") ||       
      params.get("p") ||       
      null;
    return raw ? decodeURIComponent(raw) : null;
  } catch {
    return null;
  }
}

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
