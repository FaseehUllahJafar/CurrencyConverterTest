import React, { useState } from "react";
import { convertCurrency } from "../api/currencyApi";

const ConvertCurrency: React.FC = () => {
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("EUR");
    const [amount, setAmount] = useState(1);
    const [result, setResult] = useState<number | null>(null);

    const handleConvert = async () => {
        try {
            const res = await convertCurrency({ from, to, amount });
            setResult(res.result);
        } catch (err: any) {
            alert(err?.response?.data?.message || "Conversion failed");
        }
    };

    return (
        <div>
            <h2>Convert Currency</h2>
            <input value={from} onChange={(e) => setFrom(e.target.value)} />
            <input value={to} onChange={(e) => setTo(e.target.value)} />
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            <button onClick={handleConvert}>Convert</button>
            {result !== null && <p>Result: {result}</p>}
        </div>
    );
};

export default ConvertCurrency;
