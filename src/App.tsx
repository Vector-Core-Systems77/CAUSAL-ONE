import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface CausalResult {
  cause: string;
  effect: string;
  lambda: number;
  impact: number;
  message: string;
}

function App() {
  const [cause, setCause] = useState<string>('');
  const [effect, setEffect] = useState<string>('');
  const [lambda, setLambda] = useState<number>(1.0);
  const [result, setResult] = useState<CausalResult | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function handleCalculate() {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await invoke<CausalResult>('calculate_causal_effect', {
        cause: cause.trim(),
        effect: effect.trim(),
        lambda
      });
      setResult(res);
    } catch (err: unknown) {
      console.error(err);
      setError(typeof err === 'string'? err : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', direction: 'rtl', maxWidth: '500px', margin: '0 auto' }}>
      <h1>CAUSAL-ONE | مختبر القرار السببي</h1>
      <p>λ = {lambda} | مبدأ السببية ثابت</p>

      <div style={{ marginTop: '20px' }}>
        <label>المتغير المتسبب:</label><br/>
        <input
          value={cause}
          onChange={(e) => setCause(e.target.value)}
          placeholder="مثال: الرياضة"
          style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginTop: '15px' }}>
        <label>المتغير الهدف:</label><br/>
        <input
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="مثال: المزاج"
          style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginTop: '15px' }}>
        <label>معامل السببية λ:</label><br/>
        <input
          type="number"
          step="0.1"
          min="0.01"
          max="10"
          value={lambda}
          onChange={(e) => setLambda(parseFloat(e.target.value) || 1.0)}
          style={{ width: '100%', padding: '8px', marginTop: '5px', boxSizing: 'border-box' }}
        />
      </div>

      <button
        onClick={handleCalculate}
        disabled={loading}
        style={{
          marginTop: '20px',
          width: '100%',
          padding: '12px',
          background: loading? '#ccc' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading? 'جاري الحساب...' : 'احسب التأثير السببي'}
      </button>

      {error && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#ffebee', color: '#c62828', borderRadius: '5px' }}>
          خطأ: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '5px', border: '2px solid #4CAF50' }}>
          <h3 style={{ marginTop: 0 }}>النتيجة:</h3>
          <p><b>السبب:</b> {result.cause}</p>
          <p><b>الهدف:</b> {result.effect}</p>
          <p><b>λ المستخدم:</b> {result.lambda}</p>
          <p><b>التأثير:</b> {result.impact.toFixed(3)}</p>
          <p><b>الرسالة:</b> {result.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;
