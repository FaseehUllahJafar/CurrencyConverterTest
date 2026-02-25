import '@testing-library/jest-dom';

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R;
            toHaveValue(value?: string | number | string[]): R;
        }
    }
}

// Mock the currency API functions before anything imports them
jest.mock('../api/currencyApi', () => ({
    convertCurrency: jest.fn(),
    getLatestRates: jest.fn(),
    getHistoricalRates: jest.fn()
}));

// Mock axios instance
jest.mock('../api/axiosInstance', () => ({
    default: {
        request: jest.fn(),
        get: jest.fn(),
        post: jest.fn()
    }
}));

// Mock window.alert  - used by Login component for alerts
global.alert = jest.fn();
