mod engine;
use engine::logic_kernel::CausalKernel;
use tauri::command;

#[command]
fn process_causal(input: String, mode: String) -> engine::logic_kernel::ProofResult {
    CausalKernel::new().process(&input, &mode)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
       .invoke_handler(tauri::generate_handler![process_causal])
       .run(tauri::generate_context!())
       .expect("error");
}
