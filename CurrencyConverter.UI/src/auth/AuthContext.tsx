import React, { createContext, useState, useEffect } from "react";

interface AuthContextType {
    token: string | null;
    role: string | null;
    login: (token: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: null,
    role: null,
    login: () => { },
    logout: () => { }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setRole(payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
        }
    }, [token]);

    const login = (jwt: string) => {
        localStorage.setItem("token", jwt);
        setToken(jwt);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
