use super::HPTState;
use tauri::State;

#[tauri::command]
pub fn generate_next_zero(state: State<HPTState>) -> Result<f64, String> {
    let mut op = state.0.lock().map_err(|e| e.to_string())?;
    let guess = op.seed_state.iter().sum::<f64>() / op.seed_state.len() as f64;
    let guess = if guess.abs() < 1e-6 { 10.0 } else { guess };
    op.generate_zero(guess).ok_or("فشل التوليد".into())
}

#[tauri::command]
pub fn get_spectrum(state: State<HPTState>) -> Vec<f64> {
    state.0.lock().unwrap().spectrum_buffer.clone()
}

#[tauri::command]
pub fn get_status_cmd() -> String {
    "Ismail Causal Engine — H_PT Online".to_string()
}
