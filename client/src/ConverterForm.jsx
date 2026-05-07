import { useState } from 'react';
import './ConverterForm.css';

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'SEK', 'NOK', 'DKK'];

export default function ConverterForm() {
  const [amount, setAmount] = useState('');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/conversions/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({ amount, from, to })
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({ error: 'Something went wrong. Try again.' });
    } finally {
      setLoading(false);
    }
  }

  function swapCurrencies() {
    setFrom(to);
    setTo(from);
  }

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Live exchange rates</p>
        <h1>Currency Converter</h1>
        <p className="subtitle">
          Convert currencies instantly with a clean React frontend powered by your Express + MongoDB backend.
        </p>
      </section>

      <section className="converter-card">
        <form onSubmit={handleSubmit}>
          <label>
            Amount
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>

          <div className="currency-grid">
            <label>
              From
              <select value={from} onChange={(e) => setFrom(e.target.value)}>
                {currencies.map((currency) => (
                  <option key={currency}>{currency}</option>
                ))}
              </select>
            </label>

            <button type="button" className="swap-button" onClick={swapCurrencies}>
              ⇄
            </button>

            <label>
              To
              <select value={to} onChange={(e) => setTo(e.target.value)}>
                {currencies.map((currency) => (
                  <option key={currency}>{currency}</option>
                ))}
              </select>
            </label>
          </div>

          <button className="convert-button" type="submit" disabled={loading}>
            {loading ? 'Converting...' : 'Convert now'}
          </button>
        </form>

        {result?.error && (
          <div className="error-box">
            {result.error}
          </div>
        )}

        {result?.result && (
          <div className="result-card">
            <span>Converted amount</span>
            <strong>
              {Number(result.result).toLocaleString(undefined, {
                maximumFractionDigits: 2
              })}{' '}
              {to}
            </strong>
            <p>
              {amount} {from} → {to}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}