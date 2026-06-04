mod engine;
use engine::logic_kernel::LogicKernel;
use tauri::command;

#[command]
fn prove_theorem(theorem: String) -> engine::logic_kernel::ProofResult {
    LogicKernel::new().prove(&theorem)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
       .invoke_handler(tauri::generate_handler![prove_theorem])
       .run(tauri::generate_context!())
       .expect("error");
}
