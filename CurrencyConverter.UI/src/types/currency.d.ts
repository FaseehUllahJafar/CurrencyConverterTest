export interface ExchangeRateResponse {
    base: string;
    date: string;
    rates: Record<string, number>;
}

export interface ConversionRequest {
    amount: number;
    fromCurrency: string;
    toCurrency: string;
}

export interface ConversionResponse {
    originalAmount: number;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
    convertedAmount: number;
}

export interface HistoricalRateResponse {
    base: string;
    start_Date: string;
    end_Date: string;
    rates: Record<string, Record<string, number>>;
}

export interface HistoricalRateRequest {
    baseCurrency: string;
    startDate: string;
    endDate: string;
    page: number;
    pageSize: number;
}
