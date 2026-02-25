import { render, screen, waitFor } from './testUtils';
import userEvent from '@testing-library/user-event';
import HistoricalRates from '../components/HistoricalRates';
import type { HistoricalRateResponse } from '../types/currency';

const mockGetHistoricalRates = (jest.requireMock('../api/currencyApi') as any).getHistoricalRates;

describe('HistoricalRates Component', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    const mockHistoricalData: HistoricalRateResponse = {
        base: 'USD',
        start_Date: '2024-01-01',
        end_Date: '2024-01-03',
        rates: {
            '2024-01-01': { EUR: 0.92, GBP: 0.79 },
            '2024-01-02': { EUR: 0.93, GBP: 0.80 },
            '2024-01-03': { EUR: 0.91, GBP: 0.78 }
        }
    };

    test('renders historical rates form', () => {
        render(<HistoricalRates />);
        expect(screen.getByRole('heading', { name: 'Historical Exchange Rates' })).toBeTruthy();
        expect(screen.getByRole('button', { name: /fetch/i })).toBeTruthy();
    });

    test('shows error when dates are not selected', async () => {
        const user = userEvent.setup();
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
        render(<HistoricalRates />);
        const fetchButton = screen.getByRole('button', { name: /fetch/i });
        await user.click(fetchButton);
        expect(alertSpy).toHaveBeenCalledWith('Please select start and end dates');
        alertSpy.mockRestore();
    });

    test('fetches and displays historical rates data', async () => {
        const user = userEvent.setup();
        mockGetHistoricalRates.mockResolvedValueOnce(mockHistoricalData);
        render(<HistoricalRates />);

        const dateInputs = document.querySelectorAll('input[type="date"]');
        const startDateInput = dateInputs[0] as HTMLInputElement;
        const endDateInput = dateInputs[1] as HTMLInputElement;
        const fetchButton = screen.getByRole('button', { name: /fetch/i });

        await user.type(startDateInput, '2024-01-01');
        await user.type(endDateInput, '2024-01-03');
        await user.click(fetchButton);

        await waitFor(() => {
            expect(mockGetHistoricalRates).toHaveBeenCalled();
            expect(screen.getByText('2024-01-01')).toBeTruthy();
        });
    });

    test('renders data table with exchange rates', async () => {
        const user = userEvent.setup();
        mockGetHistoricalRates.mockResolvedValueOnce(mockHistoricalData);
        render(<HistoricalRates />);

        const dateInputs = document.querySelectorAll('input[type="date"]');
        const startDateInput = dateInputs[0] as HTMLInputElement;
        const endDateInput = dateInputs[1] as HTMLInputElement;
        const fetchButton = screen.getByRole('button', { name: /fetch/i });

        await user.type(startDateInput, '2024-01-01');
        await user.type(endDateInput, '2024-01-03');
        await user.click(fetchButton);

        await waitFor(() => {
            expect(screen.getByRole('table')).toBeTruthy();
        });
    });

    test('handles fetch error gracefully', async () => {
        const user = userEvent.setup();
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
        mockGetHistoricalRates.mockRejectedValueOnce(new Error('Network error'));
        render(<HistoricalRates />);

        const dateInputs = document.querySelectorAll('input[type="date"]');
        const startDateInput = dateInputs[0] as HTMLInputElement;
        const endDateInput = dateInputs[1] as HTMLInputElement;
        const fetchButton = screen.getByRole('button', { name: /fetch/i });

        await user.type(startDateInput, '2024-01-01');
        await user.type(endDateInput, '2024-01-03');
        await user.click(fetchButton);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Failed to fetch historical data');
        });
        alertSpy.mockRestore();
    });

    test('displays loading state while fetching', async () => {
        const user = userEvent.setup();
        mockGetHistoricalRates.mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockHistoricalData), 100))
        );
        render(<HistoricalRates />);

        const dateInputs = document.querySelectorAll('input[type="date"]');
        const startDateInput = dateInputs[0] as HTMLInputElement;
        const endDateInput = dateInputs[1] as HTMLInputElement;
        const fetchButton = screen.getByRole('button', { name: /fetch/i });
        await user.type(startDateInput, '2024-01-01');
        await user.type(endDateInput, '2024-01-03');
        await user.click(fetchButton);

        expect(screen.getByText('Loading...')).toBeTruthy();
    });

    test('changes base currency to uppercase', async () => {
        const user = userEvent.setup();
        mockGetHistoricalRates.mockResolvedValueOnce(mockHistoricalData);
        render(<HistoricalRates />);

        const currencyInput = screen.getByPlaceholderText('Base Currency') as HTMLInputElement;
        const dateInputs = document.querySelectorAll('input[type="date"]');
        const startDateInput = dateInputs[0] as HTMLInputElement;
        const endDateInput = dateInputs[1] as HTMLInputElement;
        const fetchButton = screen.getByRole('button', { name: /fetch/i });

        await user.clear(currencyInput);
        await user.type(currencyInput, 'gbp');
        await user.type(startDateInput, '2024-01-01');
        await user.type(endDateInput, '2024-01-03');
        await user.click(fetchButton);

        await waitFor(() => {
            expect(mockGetHistoricalRates).toHaveBeenCalledWith(
                expect.objectContaining({
                    baseCurrency: 'GBP'
                })
            );
        });
    });

    test('shows "No data available" when response has no rates', async () => {
        const user = userEvent.setup();
        const emptyData: HistoricalRateResponse = {
            base: 'USD',
            start_Date: '2024-01-01',
            end_Date: '2024-01-03',
            rates: {}
        };
        mockGetHistoricalRates.mockResolvedValueOnce(emptyData);
        render(<HistoricalRates />);

        const dateInputs = document.querySelectorAll('input[type="date"]');
        const startDateInput = dateInputs[0] as HTMLInputElement;
        const endDateInput = dateInputs[1] as HTMLInputElement;
        const fetchButton = screen.getByRole('button', { name: /fetch/i });

        await user.type(startDateInput, '2024-01-01');
        await user.type(endDateInput, '2024-01-03');
        await user.click(fetchButton);

        await waitFor(() => {
            expect(screen.getByText('No data available.')).toBeTruthy();
        });
    });
});
