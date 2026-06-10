#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod h_pt_engine;
use serde::Serialize;

#[derive(Serialize)]
struct CausalResult {
    cause: String,
    effect: String,
    lambda: f64,
    impact: f64,
    message: String,
}

#[tauri::command]
fn calculate_causal_effect(cause: String, effect: String, lambda: f64) -> CausalResult {
    let impact = h_pt_engine::calculate_causal_effect(cause.clone(), effect.clone(), lambda);
    
    CausalResult {
        cause,
        effect,
        lambda,
        impact,
        message: format!("تم حساب التأثير السببي بنجاح")
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
       .invoke_handler(tauri::generate_handler![calculate_causal_effect])
       .run(tauri::generate_context!())
       .expect("error while running tauri application");
}
