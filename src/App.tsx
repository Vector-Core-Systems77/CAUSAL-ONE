import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [treatment, setTreatment] = useState("الرياضة");
  const [outcome, setOutcome] = useState("المزاج");
  const [result, setResult] = useState<any>(null);

  async function runQuery() {
    // ننشئ نموذج بسيط للتجربة
    const model = {
      variables: {
        الرياضة: { name: "الرياضة", var_type: "Binary" },
        المزاج: { name: "المزاج", var_type: "Continuous" },
        النوم: { name: "النوم", var_type: "Continuous" }
      },
      edges: {
        الرياضة: ["المزاج", "النوم"],
        النوم: ["المزاج"],
        المزاج: []
      },
      parents: {
        الرياضة: [],
        النوم: ["الرياضة"],
        المزاج: ["الرياضة", "النوم"]
      },
      cpds: {
        المزاج: { parents: ["الرياضة", "النوم"], mean_effect: 0.4 }
      }
    };

    const res = await invoke("run_causal_query", { model, treatment, outcome });
    setResult(res);
  }

  return (
    <div style={{ padding: 20, background: "#0a0a0a", color: "#00ff41", minHeight: "100vh" }}>
      <h1>CAUSAL-ONE | مختبر القرار السببي</h1>
      <p>λ = 1.0 | مبدأ السببية ثابت</p>

      <input value={treatment} onChange={e => setTreatment(e.target.value)} placeholder="المتغير المسبب X" />
      <input value={outcome} onChange={e => setOutcome(e.target.value)} placeholder="المتغير الهدف Y" />
      <button onClick={runQuery}>احسب التأثير السببي ATE</button>

      {result && (
        <div style={{ marginTop: 30, borderTop: "2px solid #00ff41", paddingTop: 20 }}>
          <h2>النتيجة السببية:</h2>
          <p>التأثير ATE: <b>{result.ate.toFixed(3)}</b></p>
          {result.warning && <p style={{ color: "orange" }}>⚠️ {result.warning}</p>}
          {!result.warning && <p style={{ color: "#00ff41" }}>✓ لا يوجد ارتباك. النتيجة سببية نقية</p>}
        </div>
      )}
    </div>
  );
}

export default App;
