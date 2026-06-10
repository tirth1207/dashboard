type ActiveTabState = { tabId: number; url: string; title: string; startedAt: number };
let active: ActiveTabState | null = null;

function domainFrom(url: string) { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return "unknown"; } }
async function flush(end = Date.now()) {
  if (!active || end <= active.startedAt) return;
  const payload = { source: "browser", title: active.title, domain: domainFrom(active.url), url: active.url, startedAt: new Date(active.startedAt).toISOString(), endedAt: new Date(end).toISOString(), durationSeconds: Math.round((end - active.startedAt) / 1000) };
  const { queue = [] } = await chrome.storage.local.get("queue");
  await chrome.storage.local.set({ queue: [...queue, payload].slice(-1000) });
}
async function activate(tabId: number) {
  await flush();
  const tab = await chrome.tabs.get(tabId);
  if (tab.url) active = { tabId, url: tab.url, title: tab.title ?? tab.url, startedAt: Date.now() };
}
chrome.tabs.onActivated.addListener(({ tabId }) => void activate(tabId));
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => { if (changeInfo.status === "complete") void activate(tabId); });
chrome.alarms.create("sync", { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener(async () => { await flush(); active = active ? { ...active, startedAt: Date.now() } : null; });
