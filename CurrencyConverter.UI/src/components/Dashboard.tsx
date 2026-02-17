import React, { useContext, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import ConvertCurrency from "./ConvertCurrency";
import HistoricalRates from "./HistoricalRates";
import LatestRates from "./LatestRates";

const Dashboard: React.FC = () => {
    const { role, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<string>("convert");

    return (
        <div className="dashboard-wrapper">
            <header className="dashboard-header">
                <h1>Currency Dashboard</h1>
                <button className="logout-btn" onClick={logout}>
                    Logout
                </button>
            </header>

            <nav className="dashboard-tabs">
                <button
                    className={activeTab === "convert" ? "active" : ""}
                    onClick={() => setActiveTab("convert")}
                >
                    Convert
                </button>
                <button
                    className={activeTab === "latest" ? "active" : ""}
                    onClick={() => setActiveTab("latest")}
                >
                    Latest Rates
                </button>
                {role === "Admin" && (
                    <button
                        className={activeTab === "historical" ? "active" : ""}
                        onClick={() => setActiveTab("historical")}
                    >
                        Historical
                    </button>
                )}
            </nav>

            <div className="dashboard-content">
                {activeTab === "convert" && <ConvertCurrency />}
                {activeTab === "latest" && <LatestRates />}
                {activeTab === "historical" && role === "Admin" && <HistoricalRates />}
            </div>
        </div>
    );
};

export default Dashboard;
