export interface ConversionRequest {
    amount: number;
    fromCurrency: string;
    toCurrency: string;
}

export interface ConversionResponse {
    originalAmount: number;
    fromCurrency: string;
    toCurrency: string;
    convertedAmount: number;
    rate: number;
}

export interface ExchangeRateResponse {
    base: string;
    date: string;
    rates: Record<string, number>;
}

export interface HistoricalRateRequest {
    baseCurrency: string;
    startDate: string;
    endDate: string;
    page?: number;
    pageSize?: number;
}

export interface HistoricalRateResponse {
    base: string;
    start_Date: string;
    end_Date: string;
    rates: Record<string, Record<string, number>>;
}
