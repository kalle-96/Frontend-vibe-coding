import { useState } from 'react';

export default function ConverterForm() {
    const [amount, setAmount] = useState('');
    const [from, setFrom] = useState('USD');
    const [to, setTo] = useState('EUR');
    const [result, setResult] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();

        const response = await fetch('/api/conversions/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                amount,
                from,
                to
            })
        });

        const data = await response.json();

        console.log(data);

        setResult(data);
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <select
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                >
                    <option>USD</option>
                    <option>EUR</option>
                    <option>GBP</option>
                </select>

                <select
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                >
                    <option>EUR</option>
                    <option>USD</option>
                    <option>GBP</option>
                </select>

                <button type="submit">
                    Convert
                </button>
            </form>

            {result && (
                <h2>
                    Result: {result.result}
                </h2>
            )}
        </div>
    );
}