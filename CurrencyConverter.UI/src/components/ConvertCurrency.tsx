import React, { useState } from "react";
import { convertCurrency } from "../api/currencyApi";
import type { ConversionResponse } from "../types/currency";

const ConvertCurrency: React.FC = () => {
    const [amount, setAmount] = useState<number>(1);
    const [fromCurrency, setFromCurrency] = useState<string>("USD");
    const [toCurrency, setToCurrency] = useState<string>("EUR");
    const [result, setResult] = useState<ConversionResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleConvert = async () => {
        setLoading(true);
        try {
            const data = await convertCurrency({
                amount,
                fromCurrency,
                toCurrency
            });

            setResult(data);
        } catch (error: any) {
            alert(error?.response?.data?.message || "Conversion failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Currency Converter</h2>

            <div>
                <label>Amount:</label>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
            </div>

            <div>
                <label>From:</label>
                <input
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
                />
            </div>

            <div>
                <label>To:</label>
                <input
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
                />
            </div>

            <button onClick={handleConvert} disabled={loading}>
                {loading ? "Converting..." : "Convert"}
            </button>

            {result && (
                <div>
                    <p>Original Amount: {result.originalAmount}</p>
                    <p>From Currency: {result.fromCurrency}</p>
                    <p>To Currency: {result.toCurrency}</p>
                    <p>Rate: {result.rate}</p>
                    <h3>Converted Amount: {result.convertedAmount}</h3>
                </div>
            )}
        </div>
    );
};

export default ConvertCurrency;
