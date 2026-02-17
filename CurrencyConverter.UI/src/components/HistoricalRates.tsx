import React, { useState } from "react";
import { getHistoricalRates } from "../api/currencyApi";
import type { HistoricalRateResponse } from "../types/currency";

const HistoricalRates: React.FC = () => {
    const [baseCurrency, setBaseCurrency] = useState("USD");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [data, setData] = useState<HistoricalRateResponse | null>(null);

    const handleFetch = async () => {
        try {
            const result = await getHistoricalRates({
                baseCurrency,
                startDate,
                endDate,
                page: 1,
                pageSize: 10
            });

            setData(result);
        } catch {
            alert("Failed to fetch historical data");
        }
    };

    return (
        <div>
            <h2>Historical Rates</h2>

            <input
                type="date"
                onChange={(e) => setStartDate(e.target.value)}
            />

            <input
                type="date"
                onChange={(e) => setEndDate(e.target.value)}
            />

            <input
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value.toUpperCase())}
            />

            <button onClick={handleFetch}>Fetch</button>

            {data && (
                <pre>{JSON.stringify(data.rates, null, 2)}</pre>
            )}
        </div>
    );
};

export default HistoricalRates;
