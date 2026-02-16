import React, { useState } from "react";
import { useCurrencies } from "../hooks/useCurrencies";
import { convertCurrency } from "../api/currencyApi";
import type { ConversionResponse } from "../types/currency";

const excludedCurrencies = ["TRY", "PLN", "THB", "MXN"];

export const ConversionForm: React.FC = () => {
    const currencies = useCurrencies();
    const [amount, setAmount] = useState(1);
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("EUR");
    const [result, setResult] = useState<ConversionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleConvert = async () => {
        setError("");
        setResult(null);

        if (excludedCurrencies.includes(from) || excludedCurrencies.includes(to)) {
            setError("Conversion involving TRY, PLN, THB, or MXN is not allowed.");
            return;
        }

        setLoading(true);
        try {
            const res = await convertCurrency({ amount, fromCurrency: from, toCurrency: to });
            setResult(res);
        } catch (err: any) {
            setError(err.response?.data?.message || "Conversion failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="conversion-form">
            <h2>Currency Conversion</h2>
            <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
            <select value={from} onChange={e => setFrom(e.target.value)}>
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={to} onChange={e => setTo(e.target.value)}>
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={handleConvert} disabled={loading}>{loading ? "Converting..." : "Convert"}</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {result && (
                <p>{result.originalAmount} {result.fromCurrency} = {result.convertedAmount.toFixed(2)} {result.toCurrency} (Rate: {result.rate})</p>
            )}
        </div>
    );
};
