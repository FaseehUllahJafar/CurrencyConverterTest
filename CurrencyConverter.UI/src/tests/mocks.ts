import axios from 'axios';

// Mock axios instance
jest.mock('../api/axiosInstance', () => ({
    default: {
        request: jest.fn(),
        get: jest.fn(),
        post: jest.fn()
    }
}));

// Mock the currency API
jest.mock('../api/currencyApi', () => ({
    convertCurrency: jest.fn(),
    getLatestRates: jest.fn(),
    getHistoricalRates: jest.fn()
}));

export const mockConvertCurrency = (jest.requireMock('../api/currencyApi') as any).convertCurrency;
export const mockGetHistoricalRates = (jest.requireMock('../api/currencyApi') as any).getHistoricalRates;
export const mockAxios = (jest.requireMock('../api/axiosInstance') as any).default;
