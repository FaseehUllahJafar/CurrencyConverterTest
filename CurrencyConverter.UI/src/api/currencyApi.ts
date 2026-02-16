import axios from "axios";
import type { ExchangeRateResponse, ConversionRequest, ConversionResponse, HistoricalRateRequest, HistoricalRateResponse } from "../types/currency";

const API_URL = "https://localhost:7212/api/currency"; // change port if needed

export const getLatestRates = async (baseCurrency: string): Promise<ExchangeRateResponse> => {
    const { data } = await axios.get(`${API_URL}/latest/${baseCurrency}`);
    return data;
};

export const convertCurrency = async (request: ConversionRequest): Promise<ConversionResponse> => {
    const { data } = await axios.post(`${API_URL}/convert`, request);
    return data;
};

export const getHistoricalRates = async (request: HistoricalRateRequest): Promise<HistoricalRateResponse> => {
    const { data } = await axios.get(`${API_URL}/historical`, { params: request });
    return data;
};
