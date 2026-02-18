import { render } from "@testing-library/react";
import { test } from "@jest/globals";
import HistoricalRates from "../components/HistoricalRates";

test("renders historical rates component", () => {
    render(<HistoricalRates />);
});
