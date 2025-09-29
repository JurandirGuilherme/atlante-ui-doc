import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "./index";

describe("Input component", () => {
    it("renders with the correct dataTestId", () => {
        render(<Input dataTestId="input-test" />);
        expect(screen.getByTestId("input-test")).toBeInTheDocument();
    });

    it("renders with the correct placeholder", () => {
        render(<Input dataTestId="input-test" placeholder="Enter text here" />);
        expect(screen.getByTestId("input-test")).toHaveAttribute("placeholder", "Enter text here");
    });

    it("calls the onChange function when text is typed", () => {
        const handleChange = vi.fn();
        render(
            <Input dataTestId="input-change" onChange={handleChange} />
        );

        const input = screen.getByTestId("input-change");
        fireEvent.change(input, { target: { value: "test input" } });
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it("applies the correct default styles", () => {
        render(
            <Input dataTestId="input-styles" />
        );

        const input = screen.getByTestId("input-styles");
        expect(input).toHaveStyle({
            borderRadius: "2px",
            border: "1px solid #D9D9D9",
            width: "100%",
        });
    });

    it("applies custom styles when provided", () => {
        const customStyle = {
            backgroundColor: "#f0f0f0",
            color: "#333",
        };

        render(
            <Input dataTestId="input-custom" style={customStyle} />
        );

        const input = screen.getByTestId("input-custom");
        expect(input).toHaveStyle({
            backgroundColor: "#f0f0f0",
            color: "#333",
            borderRadius: "2px",
            border: "1px solid #D9D9D9",
            width: "100%",
        });
    });

    it("renders as password input when type is password", () => {
        render(
            <Input dataTestId="input-password" type="password" />
        );

        const input = screen.getByTestId("input-password");
        expect(input).toHaveAttribute("type", "password");
    });

    it("renders with correct icons for password input", () => {
        render(
            <Input dataTestId="input-password" type="password" />
        );

        const input = screen.getByTestId("input-password");
        const iconButton = input.parentElement?.querySelector("span[role='img']");
        expect(iconButton).toBeInTheDocument();
    });

    it("handles disabled state correctly", () => {
        render(
            <Input dataTestId="input-disabled" disabled />
        );

        const input = screen.getByTestId("input-disabled");
        expect(input).toBeDisabled();
    });

    it("handles value prop correctly", () => {
        render(
            <Input dataTestId="input-value" value="test value" />
        );

        const input = screen.getByTestId("input-value");
        expect(input).toHaveValue("test value");
    });

    it("handles different input types", () => {
        render(
            <Input dataTestId="input-email" type="email" />
        );

        const input = screen.getByTestId("input-email");
        expect(input).toHaveAttribute("type", "email");
    });
});
