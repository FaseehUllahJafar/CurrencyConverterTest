import React, { useState } from "react";
import { getHistoricalRates } from "../api/currencyApi";
import type { HistoricalRateResponse } from "../types/currency";

const HistoricalRates: React.FC = () => {
    const [baseCurrency, setBaseCurrency] = useState("USD");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [data, setData] = useState<HistoricalRateResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async (newPage = 1) => {
        if (!startDate || !endDate) {
            alert("Please select start and end dates");
            return;
        }

        try {
            setLoading(true);

            const result = await getHistoricalRates({
                baseCurrency,
                startDate,
                endDate,
                page: newPage,
                pageSize
            });

            setData(result);
            setPage(newPage);
        } catch {
            alert("Failed to fetch historical data");
        } finally {
            setLoading(false);
        }
    };

    const renderTable = () => {
        if (!data) return null;

        const dates = Object.keys(data.rates);
        if (dates.length === 0) return <p>No data available.</p>;

        const currencies = Object.keys(data.rates[dates[0]]);

        return (
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            {currencies.map((cur) => (
                                <th key={cur}>{cur}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dates.map((date) => (
                            <tr key={date}>
                                <td>{date}</td>
                                {currencies.map((cur) => (
                                    <td key={cur}>
                                        {data.rates[date][cur]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="historical-wrapper">
            <div className="card">
                <h2>Historical Exchange Rates</h2>

                <div className="filters">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />

                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />

                    <input
                        value={baseCurrency}
                        onChange={(e) =>
                            setBaseCurrency(e.target.value.toUpperCase())
                        }
                        placeholder="Base Currency"
                    />

                    <select
                        value={pageSize}
                        onChange={(e) =>
                            setPageSize(Number(e.target.value))
                        }
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </select>

                    <button onClick={() => fetchData(1)}>Fetch</button>
                </div>

                {loading && <p className="loading">Loading...</p>}

                {data && renderTable()}

                {data && (
                    <div className="pagination">
                        <button
                            onClick={() => fetchData(page - 1)}
                            disabled={page === 1}
                        >
                            Previous
                        </button>

                        <span>Page {page}</span>

                        <button onClick={() => fetchData(page + 1)}>
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoricalRates;
