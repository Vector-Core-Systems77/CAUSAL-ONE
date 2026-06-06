#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
struct GreetArgs {
    name: String,
}

#[command]
fn run_causal_query() -> String {
    "Hello from CAUSAL-ONE".into()
}

fn main() {
    tauri::Builder::default()
       .invoke_handler(tauri::generate_handler![run_causal_query])
       .run(tauri::generate_context!())
       .expect("error while running tauri application");
}
