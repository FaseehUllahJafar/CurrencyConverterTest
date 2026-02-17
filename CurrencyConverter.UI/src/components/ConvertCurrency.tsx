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
        if (!amount || amount <= 0) {
            alert("Please enter a valid amount");
            return;
        }

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

    const handleSwap = () => {
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
        setResult(null);
    };

    return (
        <div className="convert-wrapper">
            <div className="card">
                <h2>Currency Converter</h2>

                <div className="convert-grid">
                    <div className="form-group">
                        <label>Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) =>
                                setAmount(Number(e.target.value))
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label>From</label>
                        <input
                            value={fromCurrency}
                            onChange={(e) =>
                                setFromCurrency(
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>

                    <div className="swap-container">
                        <button
                            className="swap-btn"
                            onClick={handleSwap}
                        >
                            ⇄
                        </button>
                    </div>

                    <div className="form-group">
                        <label>To</label>
                        <input
                            value={toCurrency}
                            onChange={(e) =>
                                setToCurrency(
                                    e.target.value.toUpperCase()
                                )
                            }
                        />
                    </div>
                </div>

                <button
                    className="convert-btn"
                    onClick={handleConvert}
                    disabled={loading}
                >
                    {loading ? "Converting..." : "Convert"}
                </button>

                {result && (
                    <div className="result-card">
                        <p>
                            <strong>{result.originalAmount}</strong>{" "}
                            {result.fromCurrency} =
                        </p>
                        <h3>
                            {result.convertedAmount}{" "}
                            {result.toCurrency}
                        </h3>
                        <p className="rate-info">
                            Exchange Rate: {result.rate}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConvertCurrency;
