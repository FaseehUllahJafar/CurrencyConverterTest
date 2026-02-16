import axios from "axios";

const instance = axios.create({
    baseURL: "https://localhost:7057/api",
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

instance.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        if (error.response?.status === 429) {
            alert("Too many requests. Please try again in a minute.");
        }
        return Promise.reject(error);
    }
);

export default instance;
