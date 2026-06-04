import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [theorem, setTheorem] = useState("برهن: إذا كان n² زوجي فـ n زوجي");
  const [result, setResult] = useState<any>(null);

  async function runProof() {
    const proof = await invoke("prove_theorem", { theorem });
    setResult(proof);
  }

  return (
    <div className="container">
      <h1>CAUSAL-ONE | مختبر البراهين</h1>
      <input value={theorem} onChange={(e) => setTheorem(e.target.value)} />
      <button onClick={runProof}>برهن</button>
      {result?.valid && result.steps.map((s: any) => <p key={s.step_number}>{s.statement}</p>)}
    </div>
  );
}
export default App;
