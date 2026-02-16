export interface ExchangeRateResponse {
    base: string;
    date: string;
    rates: Record<string, number>;
}

export interface ConversionRequest {
    from: string;
    to: string;
    amount: number;
}

export interface ConversionResponse {
    from: string;
    to: string;
    amount: number;
    result: number;
}

export interface HistoricalRateRequest {
    baseCurrency: string;
    startDate: string; // yyyy-MM-dd
    endDate: string;   // yyyy-MM-dd
    page?: number;
    pageSize?: number;
}

export interface HistoricalRateResponse {
    base: string;
    start_Date: string;
    end_Date: string;
    rates: Record<string, Record<string, number>>;
}
