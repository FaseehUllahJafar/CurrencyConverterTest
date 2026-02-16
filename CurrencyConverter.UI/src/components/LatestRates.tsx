import React, { useState } from "react";
import { getLatestRates } from "../api/currencyApi";

const LatestRates: React.FC = () => {
    const [baseCurrency, setBaseCurrency] = useState("USD");
    const [rates, setRates] = useState<Record<string, number> | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFetch = async () => {
        try {
            setLoading(true);
            const data = await getLatestRates(baseCurrency);
            setRates(data.rates);
        } catch (error) {
            alert("Failed to fetch latest rates");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Latest Rates</h2>

            <input
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value.toUpperCase())}
                placeholder="Base Currency (e.g. USD)"
            />

            <button onClick={handleFetch} disabled={loading}>
                {loading ? "Loading..." : "Get Latest Rates"}
            </button>

            {rates && (
                <table border={1} cellPadding={5} style={{ marginTop: "10px" }}>
                    <thead>
                        <tr>
                            <th>Currency</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(rates).map(([currency, rate]) => (
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

export default LatestRates;
