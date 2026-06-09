mod h_pt_engine;
mod commands;

use h_pt_engine::HptOperator;
use std::sync::Mutex;
use tauri::Manager;

pub struct HPTState(pub Mutex<HptOperator>);

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
       .manage(HPTState(Mutex::new(HptOperator::new())))
       .invoke_handler(tauri::generate_handler![
            commands::generate_next_zero,
            commands::get_spectrum,
            commands::get_status_cmd
        ])
       .run(tauri::generate_context!())
       .expect("error while running tauri application");
}
