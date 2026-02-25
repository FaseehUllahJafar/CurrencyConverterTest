import { render, screen, waitFor } from './testUtils';
import userEvent from '@testing-library/user-event';
const mockAxios = (jest.requireMock('../api/axiosInstance') as any).default;
import Login from '../auth/Login';

describe('Login Flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    test('renders login form with test credentials helper', () => {
        render(<Login />);
        expect(screen.getByRole('heading', { name: 'Login' })).toBeTruthy();
        expect(screen.getByText(/Test Users:/i)).toBeTruthy();
        expect(screen.getByText(/admin \/ admin/i)).toBeTruthy();
        expect(screen.getByText(/user \/ user/i)).toBeTruthy();
    });

    test('shows error when username or password is empty', async () => {
        const user = userEvent.setup();
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
        render(<Login />);
        const loginButton = screen.getByRole('button', { name: /login/i });
        await user.click(loginButton);
        expect(alertSpy).toHaveBeenCalledWith('Please enter username and password');
        alertSpy.mockRestore();
    });
});
