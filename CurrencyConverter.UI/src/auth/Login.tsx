import React, { useState, useContext } from "react";
import axios from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";

const Login: React.FC = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            alert("Please enter username and password");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(
                "/auth/login",
                null,
                { params: { username, password } }
            );
            login(res.data.token);
            window.location.href = "/";
        } catch {
            alert("Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <h2>Login</h2>

                <p className="test-credentials">
                    <strong>Test Users:</strong><br />
                    Admin: <code>admin / admin</code><br />
                    User: <code>user / user</code>
                </p>

                <div className="login-form">
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                    <button onClick={handleLogin} disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
