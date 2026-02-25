import { render, screen, waitFor } from './testUtils';
import userEvent from '@testing-library/user-event';
import ConvertCurrency from '../components/ConvertCurrency';
import type { ConversionResponse } from '../types/currency';

const mockConvertCurrency = (jest.requireMock('../api/currencyApi') as any).convertCurrency;

describe('ConvertCurrency Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders converter form with initial values', () => {
        render(<ConvertCurrency />);
        expect(screen.getByRole('heading', { name: 'Currency Converter' })).toBeTruthy();
        expect(screen.getByRole('button', { name: /convert/i })).toBeTruthy();
    });

    test('displays error when amount is invalid', async () => {
        const user = userEvent.setup();
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
        render(<ConvertCurrency />);
        const amountInput = screen.getByRole('spinbutton') as HTMLInputElement;
        const convertButton = screen.getByRole('button', { name: /convert/i });
        await user.clear(amountInput);
        await user.type(amountInput, '0');
        await user.click(convertButton);
        expect(alertSpy).toHaveBeenCalledWith('Please enter a valid amount');
        alertSpy.mockRestore();
    });

    test('successfully converts currency', async () => {
        const user = userEvent.setup();
        const mockResponse: ConversionResponse = {
            originalAmount: 100,
            fromCurrency: 'USD',
            toCurrency: 'EUR',
            convertedAmount: 92.5,
            rate: 0.925
        };
        mockConvertCurrency.mockResolvedValueOnce(mockResponse);
        render(<ConvertCurrency />);
        const amountInput = screen.getByRole('spinbutton') as HTMLInputElement;
        const textInputs = screen.getAllByRole('textbox');
        const fromInput = textInputs[0] as HTMLInputElement;
        const toInput = textInputs[1] as HTMLInputElement;
        const convertButton = screen.getByRole('button', { name: /convert/i });

        await user.clear(amountInput);
        await user.type(amountInput, '100');
        // ensure inputs have expected values before clicking
        expect(amountInput.value).toBe('100');
        expect(fromInput.value).toBe('USD');
        expect(toInput.value).toBe('EUR');

        await user.click(convertButton);

        await waitFor(() => {
            expect(mockConvertCurrency).toHaveBeenCalledWith({
                amount: 100,
                fromCurrency: 'USD',
                toCurrency: 'EUR'
            });
        });

        // Use findByText to wait for result rendering
        expect(await screen.findByText('100')).toBeTruthy();
        expect(await screen.findByText(/Exchange Rate:/i)).toBeTruthy();
    });

    test('handles conversion API error', async () => {
        const user = userEvent.setup();
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
        mockConvertCurrency.mockRejectedValueOnce({
            response: { data: { message: 'Invalid currency' } }
        });
        render(<ConvertCurrency />);
        const convertButton = screen.getByRole('button', { name: /convert/i });
        await user.click(convertButton);
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Invalid currency');
        });
        alertSpy.mockRestore();
    });

    test('swaps currencies when swap button is clicked', async () => {
        const user = userEvent.setup();
        render(<ConvertCurrency />);
        const textInputs = screen.getAllByRole('textbox');
        const fromInput = textInputs[0] as HTMLInputElement;
        const toInput = textInputs[1] as HTMLInputElement;
        expect(fromInput.value).toBe('USD');
        expect(toInput.value).toBe('EUR');
        const swapButton = screen.getByText('⇄');
        await user.click(swapButton);
        await waitFor(() => {
            expect(fromInput.value).toBe('EUR');
            expect(toInput.value).toBe('USD');
        });
    });

    test('converts currencies in uppercase', async () => {
        const user = userEvent.setup();
        const mockResponse: ConversionResponse = {
            originalAmount: 50,
            fromCurrency: 'GBP',
            toCurrency: 'JPY',
            convertedAmount: 7500,
            rate: 150
        };
        mockConvertCurrency.mockResolvedValueOnce(mockResponse);
        render(<ConvertCurrency />);
        const textInputs = screen.getAllByRole('textbox');
        const fromInput = textInputs[0] as HTMLInputElement;
        const toInput = textInputs[1] as HTMLInputElement;
        await user.clear(fromInput);
        await user.type(fromInput, 'gbp');
        await user.clear(toInput);
        await user.type(toInput, 'jpy');
        const convertButton = screen.getByRole('button', { name: /convert/i });
        await user.click(convertButton);
        await waitFor(() => {
            expect(mockConvertCurrency).toHaveBeenCalledWith({
                amount: 1,
                fromCurrency: 'GBP',
                toCurrency: 'JPY'
            });
        });
    });

    test('shows loading state during conversion', async () => {
        const user = userEvent.setup();
        const mockResponse: ConversionResponse = {
            originalAmount: 100,
            fromCurrency: 'USD',
            toCurrency: 'EUR',
            convertedAmount: 92.5,
            rate: 0.925
        };
        mockConvertCurrency.mockImplementationOnce(
            () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
        );
        render(<ConvertCurrency />);
        const convertButton = screen.getByRole('button', { name: /convert/i });
        await user.click(convertButton);
        expect(screen.getByRole('button', { name: /converting/i })).toBeTruthy();
    });
});
