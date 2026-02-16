import React, { useState, useContext } from "react";
import axios from "../api/axiosInstance";
import { AuthContext } from "./AuthContext";

const Login: React.FC = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post("/auth/login", null, { params: { username, password } });
            login(res.data.token);
            window.location.href = "/";
        } catch {
            alert("Invalid credentials");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;
