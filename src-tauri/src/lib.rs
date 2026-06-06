mod engine;
use engine::inference::{CausalModel, InterventionResult};
use tauri::command;

#[command]
fn run_causal_query(model: CausalModel, treatment: String, outcome: String) -> InterventionResult {
    model.intervene(&treatment, &outcome)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
       .invoke_handler(tauri::generate_handler![run_causal_query])
       .run(tauri::generate_context!())
       .expect("error while running tauri application");
}
