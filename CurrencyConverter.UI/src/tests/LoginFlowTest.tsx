import { render, screen } from "@testing-library/react";
import Login from "../auth/Login";
import { expect, test } from "@jest/globals";

test("shows test credentials", () => {
    render(<Login />);

    expect(screen.getByText(/admin \/ admin/i)).toBeInTheDocument();
});
