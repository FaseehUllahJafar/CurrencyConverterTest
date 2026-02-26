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
        url: "v1/currency/convert",
        data: data
    });

    return res.data;
};

export const getLatestRates = async (
    baseCurrency: string
): Promise<ExchangeRateResponse> => {
    const res = await axios.get("v1/currency/latest", {
        params: { baseCurrency }
    });

    return res.data;
};

export const getHistoricalRates = async (
    data: HistoricalRateRequest
): Promise<HistoricalRateResponse> => {

    console.log(data);
    const res = await axios.get("v1/currency/historical", {
        params: data
    });

    return res.data;
};
