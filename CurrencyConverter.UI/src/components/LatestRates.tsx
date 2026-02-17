import React, { useState } from "react";
import { getLatestRates } from "../api/currencyApi";

const LatestRates: React.FC = () => {
    const [baseCurrency, setBaseCurrency] = useState("USD");
    const [rates, setRates] = useState<Record<string, number> | null>(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const handleFetch = async () => {
        if (!baseCurrency) {
            alert("Please enter a base currency");
            return;
        }

        try {
            setLoading(true);
            const data = await getLatestRates(baseCurrency);
            setRates(data.rates);
        } catch {
            alert("Failed to fetch latest rates");
        } finally {
            setLoading(false);
        }
    };

    const filteredRates =
        rates &&
        Object.entries(rates)
            .filter(([currency]) =>
                currency.toLowerCase().includes(search.toLowerCase())
            )
            .sort((a, b) => a[0].localeCompare(b[0]));

    return (
        <div className="latest-wrapper">
            <div className="card">
                <h2>Latest Exchange Rates</h2>

                <div className="latest-controls">
                    <input
                        value={baseCurrency}
                        onChange={(e) =>
                            setBaseCurrency(e.target.value.toUpperCase())
                        }
                        placeholder="Base Currency (e.g. USD)"
                    />

                    <input
                        placeholder="Search currency..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button onClick={handleFetch} disabled={loading}>
                        {loading ? "Loading..." : "Fetch Rates"}
                    </button>
                </div>

                {rates && (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Currency</th>
                                    <th>Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRates?.map(([currency, rate]) => (
                                    <tr key={currency}>
                                        <td>{currency}</td>
                                        <td>{rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {rates && filteredRates?.length === 0 && (
                    <p>No currencies match your search.</p>
                )}
            </div>
        </div>
    );
};

export default LatestRates;
