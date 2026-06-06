#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize)]
pub struct GreetArgs {
    name: String,
}

#[tauri::command]
fn run_causal_query() -> Result<String, String> {
    Ok("Hello from CAUSAL-ONE Rust Backend".into())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
       .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
            }
            Ok(())
        })
       .invoke_handler(tauri::generate_handler![run_causal_query])
       .run(tauri::generate_context!())
       .expect("error while running tauri application");
}

fn main() {
    run();
}
