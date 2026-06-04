import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("logic"); // الافتراضي
  const [result, setResult] = useState<any>(null);

  async function runCausal() {
    // هنا ننادي المحرك الجديد بـ "مدخل" و "نمط"
    const res = await invoke("process_causal", { input, mode });
    setResult(res);
  }

  return (
    <div className="container">
      <h1>CAUSAL-ONE | المحرك السببي</h1>
      
      <select onChange={(e) => setMode(e.target.value)} value={mode}>
        <option value="logic">منطق (براهين)</option>
        <option value="physics">فيزياء (جاذبية)</option>
        <option value="riemann">رياضيات (أصفار ريمان)</option>
      </select>

      <input 
        value={input} 
        onChange={(e) => setInput(e.target.value)} 
        placeholder="أدخل المعطيات هنا..." 
      />

      <button onClick={runCausal}>تحليل سببي</button>

      {result && (
        <div className="proof">
          <h2>النتيجة: {result.theorem}</h2>
          <p><b>التحليل:</b> {result.analysis}</p>
          {result.steps?.map((s: any) => (
            <p key={s.step_number}>{s.step_number}. {s.statement} [{s.rule}]</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
