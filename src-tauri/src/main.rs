#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
struct CausalResult {
    cause: String,
    effect: String,
    lambda: f64,
    impact: f64,
    message: String,
}

#[tauri::command]
fn calculate_causal_effect(cause: String, effect: String, lambda: f64) -> Result<CausalResult, String> {
    // تحقق من المدخلات
    if cause.trim().is_empty() {
        return Err("المتغير المتسبب لا يمكن أن يكون فارغ".into());
    }
    if effect.trim().is_empty() {
        return Err("المتغير الهدف لا يمكن أن يكون فارغ".into());
    }
    if lambda <= 0.0 {
        return Err("قيمة لامدا يجب أن تكون أكبر من صفر".into());
    }

    // هنا حط معادلتك السببية الحقيقية
    // مثال: معادلة بسيطة للتجربة
    let impact = lambda * (cause.len() as f64) / (effect.len() as f64 + 1.0);

    Ok(CausalResult {
        cause: cause.clone(),
        effect: effect.clone(),
        lambda,
        impact,
        message: format!("التأثير السببي من '{}' إلى '{}' = {:.3}", cause, effect, impact),
    })
}

fn main() {
    tauri::Builder::default()
       .invoke_handler(tauri::generate_handler![calculate_causal_effect])
       .run(tauri::generate_context!())
       .expect("error while running tauri application");
}
