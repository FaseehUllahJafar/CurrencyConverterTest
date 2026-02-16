import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-runtime";

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    const { token } = useContext(AuthContext);
    if (!token) return <Navigate to="/login" />;
    return children;
};

export default ProtectedRoute;
