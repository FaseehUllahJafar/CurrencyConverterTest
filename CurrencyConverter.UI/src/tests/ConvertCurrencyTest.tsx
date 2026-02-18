import { render, screen, fireEvent } from "@testing-library/react";
import { test } from "@jest/globals";
import ConvertCurrency from "../components/ConvertCurrency";

test("renders converter form", () => {
    render(<ConvertCurrency />);

    expect(screen.getByText("Currency Converter")).toBeInTheDocument();
    expect(screen.getByText("Convert")).toBeInTheDocument();
});
