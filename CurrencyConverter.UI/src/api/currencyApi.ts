import axios from "./axiosInstance";
import type {
    ConversionRequest,
    ConversionResponse,
    ExchangeRateResponse,
    HistoricalRateRequest,
    HistoricalRateResponse
} from "../types/currency";

export const convertCurrency = async (
    data: ConversionRequest
): Promise<ConversionResponse> => {
    const res = await axios.request({
        method: "POST",
        url: "/currency/convert",
        data: data
    });

    return res.data;
};

export const getLatestRates = async (
    baseCurrency: string
): Promise<ExchangeRateResponse> => {
    const res = await axios.get("/currency/latest", {
        params: { baseCurrency }
    });

    return res.data;
};

export const getHistoricalRates = async (
    params: HistoricalRateRequest
): Promise<HistoricalRateResponse> => {
    const res = await axios.get("/currency/historical", {
        params
    });

    return res.data;
};
