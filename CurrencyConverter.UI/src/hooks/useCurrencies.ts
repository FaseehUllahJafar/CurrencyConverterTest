import { useState, useEffect } from "react";

export const useCurrencies = () => {
    const [currencies, setCurrencies] = useState<string[]>([]);

    useEffect(() => {
        setCurrencies([
            "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY"
        ]); // you can expand or fetch dynamically
    }, []);

    return currencies;
};
