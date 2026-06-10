use serde::Serialize;

#[derive(Serialize)]
struct WindowSnapshot {
    app_name: String,
    window_title: String,
    platform: String,
    captured_at: String,
}

#[tauri::command]
fn active_window_snapshot() -> WindowSnapshot {
    WindowSnapshot {
        app_name: platform_app_name(),
        window_title: platform_window_title(),
        platform: std::env::consts::OS.to_string(),
        captured_at: time::OffsetDateTime::now_utc().format(&time::format_description::well_known::Rfc3339).unwrap_or_else(|_| "1970-01-01T00:00:00Z".to_string()),
    }
}

#[cfg(target_os = "windows")]
fn platform_app_name() -> String { "Windows foreground application".to_string() }
#[cfg(target_os = "macos")]
fn platform_app_name() -> String { "macOS frontmost application".to_string() }
#[cfg(target_os = "linux")]
fn platform_app_name() -> String { "Linux active window".to_string() }
#[cfg(not(any(target_os = "windows", target_os = "macos", target_os = "linux")))]
fn platform_app_name() -> String { "Unsupported platform".to_string() }

fn platform_window_title() -> String { "LifeOS secure local capture".to_string() }

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![active_window_snapshot])
        .run(tauri::generate_context!())
        .expect("failed to run LifeOS desktop agent");
}
