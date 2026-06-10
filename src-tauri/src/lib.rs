#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod h_pt_engine;
use h_pt_engine::calculate_causal_effect as hpt_calc;

#[tauri::command]
fn calculate_causal_effect(cause: String, effect: String, lambda: f64) -> String {
    hpt_calc(cause, effect, lambda)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
       .invoke_handler(tauri::generate_handler![calculate_causal_effect])
       .run(tauri::generate_context!())
       .expect("error while running tauri application");
}
