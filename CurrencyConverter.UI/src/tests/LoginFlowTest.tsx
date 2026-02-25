import { render, screen, waitFor } from './testUtils';
import userEvent from '@testing-library/user-event';
jest.mock('../api/axiosInstance', () => ({
    default: {
        post: jest.fn()
    }
}));
const mockAxios = (jest.requireMock('../api/axiosInstance') as any).default;
import Login from '../auth/Login';

describe('Login Flow', () => {
    beforeEach(() => {
        jest.resetAllMocks();
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

    test('successfully logs in with valid credentials', async () => {
        const user = userEvent.setup();
        const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
        mockAxios.post.mockResolvedValueOnce({ data: { token: testToken } });
        render(<Login />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });
        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'admin');
        await user.click(loginButton);
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
        await waitFor(() => {
            expect(alertSpy).not.toHaveBeenCalled();
        });
        alertSpy.mockRestore();
    });

    test('handles login failure gracefully', async () => {
        const user = userEvent.setup();
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
        mockAxios.post.mockRejectedValueOnce({
            response: { data: { message: 'Invalid credentials' } }
        });
        render(<Login />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });
        await user.type(usernameInput, 'wrong');
        await user.type(passwordInput, 'wrong');
        await user.click(loginButton);
        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith('Invalid credentials');
        });
        alertSpy.mockRestore();
    });

    test('shows loading state while authenticating', async () => {
        const user = userEvent.setup();
        const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
        mockAxios.post.mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve({ data: { token: testToken } }), 100))
        );
        render(<Login />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        const loginButton = screen.getByRole('button', { name: /login/i });
        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'admin');
        await user.click(loginButton);
        // button should be disabled while authentication is in progress
        expect((loginButton as HTMLButtonElement).disabled).toBe(true);
    });

    test('allows login with Enter key', async () => {
        const user = userEvent.setup();
        const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
        mockAxios.post.mockResolvedValueOnce({ data: { token: testToken } });
        render(<Login />);
        const usernameInput = screen.getByPlaceholderText('Username');
        const passwordInput = screen.getByPlaceholderText('Password');
        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'admin');
        const alertSpy = jest.spyOn(window, 'alert').mockImplementation();
        await user.keyboard('{Enter}');
        await waitFor(() => {
            expect(alertSpy).not.toHaveBeenCalled();
        });
        alertSpy.mockRestore();
    });
});
