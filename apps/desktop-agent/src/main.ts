import { invoke } from "@tauri-apps/api/core";

async function refresh() {
  const event = await invoke("active_window_snapshot");
  document.querySelector("#app")!.innerHTML = `<h1>LifeOS AI Desktop Agent</h1><pre>${JSON.stringify(event, null, 2)}</pre>`;
}
setInterval(refresh, 5000);
void refresh();
