import React, { useState } from "react";
import { getHistoricalRates } from "../api/currencyApi";

const HistoricalRates: React.FC = () => {
    const [baseCurrency, setBaseCurrency] = useState("USD");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [rates, setRates] = useState<any>(null);

    const handleFetch = async () => {
        try {
            const data = await getHistoricalRates({ baseCurrency, startDate, endDate });
            setRates(data.rates);
        } catch {
            alert("Failed to fetch historical rates");
        }
    };

    return (
        <div>
            <h2>Historical Rates (Admin)</h2>
            <input type="date" onChange={(e) => setStartDate(e.target.value)} />
            <input type="date" onChange={(e) => setEndDate(e.target.value)} />
            <input value={baseCurrency} onChange={(e) => setBaseCurrency(e.target.value)} />
            <button onClick={handleFetch}>Get Rates</button>
            {rates && <pre>{JSON.stringify(rates, null, 2)}</pre>}
        </div>
    );
};

export default HistoricalRates;
