import React, { useState, useEffect } from "react";
import { getHistoricalRates } from "../api/currencyApi";
import type { HistoricalRateResponse, HistoricalRateRequest } from "../types/currency";
import { format } from "date-fns";
import { useCurrencies } from "../hooks/useCurrencies";

export const HistoricalRates: React.FC = () => {
    const currencies = useCurrencies();
    const [base, setBase] = useState("USD");
    const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [page, setPage] = useState(1);
    const [data, setData] = useState<HistoricalRateResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchHistorical = async () => {
        setLoading(true);
        const request: HistoricalRateRequest = {
            baseCurrency: base,
            startDate,
            endDate,
            page,
            pageSize: 10
        };
        const res = await getHistoricalRates(request);
        setData(res);
        setLoading(false);
    };

    useEffect(() => { fetchHistorical(); }, [base, startDate, endDate, page]);

    return (
        <div>
            <h2>Historical Rates</h2>
            <select value={base} onChange={e => setBase(e.target.value)}>
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            {loading && <p>Loading...</p>}
            {data && (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Currency</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(data.rates).map(([date, rates]) => (
                            Object.entries(rates).map(([currency, rate]) => (
                                <tr key={`${date}-${currency}`}>
                                    <td>{date}</td>
                                    <td>{currency}</td>
                                    <td>{rate}</td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            )}
            <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Prev</button>
            <button onClick={() => setPage(prev => prev + 1)}>Next</button>
        </div>
    );
};
