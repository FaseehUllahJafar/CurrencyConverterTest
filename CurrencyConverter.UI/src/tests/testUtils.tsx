import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '../auth/AuthContext';

interface AllTheProvidersProps {
    children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> { }

const customRender = (
    ui: ReactElement,
    options?: CustomRenderOptions
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
