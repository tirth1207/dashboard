document.getElementById("export")?.addEventListener("click", async () => {
  const { queue = [] } = await chrome.storage.local.get("queue");
  await navigator.clipboard.writeText(JSON.stringify(queue, null, 2));
  const status = document.getElementById("status");
  if (status) status.textContent = `Copied ${queue.length} local events.`;
});
