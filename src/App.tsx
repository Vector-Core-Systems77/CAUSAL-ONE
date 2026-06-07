import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

function App() {
  const [cause, setCause] = useState('');
  const [effect, setEffect] = useState('');
  const [lambda] = useState(1.0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCalculate() {
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const res = await invoke('calculate_causal_effect', {
        cause: cause.trim(),
        effect: effect.trim(),
        lambda
      });
      setResult(res);
    } catch (err) {
      console.error(err);
      setError(err || 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', direction: 'rtl' }}>
      <h1>CAUSAL-ONE | مختبر القرار السببي</h1>
      <p>λ = {lambda} | مبدأ السببية ثابت</p>

      <div style={{ marginTop: '20px' }}>
        <label>المتغير المتسبب:</label><br/>
        <input
          value={cause}
          onChange={(e) => setCause(e.target.value)}
          placeholder="مثال: الرياضة"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <div style={{ marginTop: '15px' }}>
        <label>المتغير الهدف:</label><br/>
        <input
          value={effect}
          onChange={(e) => setEffect(e.target.value)}
          placeholder="مثال: المزاج"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>

      <button
        onClick={handleCalculate}
        disabled={loading}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: loading? 'not-allowed' : 'pointer'
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
        <div style={{ marginTop: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '5px' }}>
          <h3>النتيجة:</h3>
          <p><b>السبب:</b> {result.cause}</p>
          <p><b>الهدف:</b> {result.effect}</p>
          <p><b>التأثير:</b> {result.impact.toFixed(3)}</p>
          <p><b>الرسالة:</b> {result.message}</p>
        </div>
      )}
    </div>
  );
}

export default App;
