import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import ConvertCurrency from "./ConvertCurrency";
import HistoricalRates from "./HistoricalRates";
import LatestRates from "./LatestRates";

const Dashboard: React.FC = () => {
    const { role, logout } = useContext(AuthContext);

    return (
        <div>
            <h1>Currency Dashboard</h1>
            <button onClick={logout}>Logout</button>
            <hr />
            <ConvertCurrency />
            <hr />
            <LatestRates />
            {role === "Admin" && (
                <>
                    <hr />
                    <HistoricalRates />
                </>
            )}
        </div>
    );
};

export default Dashboard;
