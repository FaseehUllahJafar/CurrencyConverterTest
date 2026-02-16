import React, { useEffect, useState } from "react";
import { useCurrencies } from "../hooks/useCurrencies";
import { getLatestRates } from "../api/currencyApi";
import type { ExchangeRateResponse } from "../types/currency";

export const LatestRates: React.FC = () => {
    const currencies = useCurrencies();
    const [base, setBase] = useState("USD");
    const [rates, setRates] = useState<ExchangeRateResponse | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        getLatestRates(base).then(setRates).finally(() => setLoading(false));
    }, [base]);

    return (
        <div>
            <h2>Latest Rates</h2>
            <select value={base} onChange={e => setBase(e.target.value)}>
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {loading && <p>Loading...</p>}
            {rates && (
                <table>
                    <thead>
                        <tr>
                            <th>Currency</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(rates.rates).map(([currency, rate]) => (
                            <tr key={currency}>
                                <td>{currency}</td>
                                <td>{rate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
