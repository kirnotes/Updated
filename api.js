import { CONFIG } from "./config.js";

function toFormBody(data) {
  const params = new URLSearchParams();
  Object.entries(data).forEach(([key, value]) => {
    params.append(key, value == null ? "" : String(value));
  });
  return params;
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, error: text || "Invalid JSON response" };
  }
}

export async function pingBackend() {
  try {
    const url = new URL(CONFIG.APPS_SCRIPT_WEBAPP_URL);
    url.searchParams.set("action", "ping");

    const res = await fetch(url.toString(), {
      method: "GET"
    });

    return await safeJson(res);
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

export async function saveNote(payload) {
  try {
    const body = toFormBody({
      action: "saveNote",
      timestamp: payload.timestamp,
      localDate: payload.localDate,
      userId: payload.userId,
      agentName: payload.agentName,
      panel: payload.panel,
      wrapCode: payload.wrapCode,
      keyword: payload.keyword,
      Issue: payload.Issue,
      resolution: payload.resolution,
      credit: payload.credit,
      refund: payload.refund,
      finalNote: payload.finalNote
    });

    const res = await fetch(CONFIG.APPS_SCRIPT_WEBAPP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: body.toString()
    });

    return await safeJson(res);
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

export async function fetchAnalytics(agentName) {
  try {
    const url = new URL(CONFIG.APPS_SCRIPT_WEBAPP_URL);
    url.searchParams.set("action", "analytics");
    url.searchParams.set("agentName", agentName || "");
    url.searchParams.set("localDate", new Date().toLocaleDateString("en-CA"));

    const res = await fetch(url.toString(), {
      method: "GET"
    });

    return await safeJson(res);
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

export async function logSession({ type, agentName, userId }) {
  try {
    const body = toFormBody({
      action: type,
      timestamp: new Date().toISOString(),
      localDate: new Date().toLocaleDateString("en-CA"),
      userId: userId || "",
      agentName: agentName || ""
    });

    const res = await fetch(CONFIG.APPS_SCRIPT_WEBAPP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      },
      body: body.toString()
    });

    return await safeJson(res);
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}
