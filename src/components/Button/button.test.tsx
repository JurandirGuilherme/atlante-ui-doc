import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "./index";
import { SearchOutlined } from "@ant-design/icons";

describe("Button component", () => {
    it("render with the correct text", () => {
        render(<Button dataTestId="btn-test">Click here</Button>);
        expect(screen.getByTestId("btn-test").textContent).toBe("Click here");
    });

    it("calls the onClick function when clicked", () => {
        const handleClick = vi.fn();
        render(
            <Button dataTestId="btn-click" onClick={handleClick}>
                Click here
            </Button>
        );

        fireEvent.click(screen.getByTestId("btn-click"));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("applies the correct style to the primary button", () => {
        render(
            <Button dataTestId="btn-primary" variant="primary">
                Primary
            </Button>
        );

        const button = screen.getByTestId("btn-primary");
        expect(button).toHaveStyle({
            backgroundColor: "#181A4A",
            color: "#FFFFFF",
        });
    });

    it("applies the correct style to the default button", () => {
        render(
            <Button dataTestId="btn-default" variant="default">
                Default Button
            </Button>
        );

        const button = screen.getByTestId("btn-default");
        expect(button).toHaveStyle({
            backgroundColor: "#FFFFFF",
            color: "#000000",
            border: "1px solid #D9D9D9",
        });
    });

    it("renders with an icon when passed", () => {
        render(
            <Button dataTestId="btn-icon" icon={<SearchOutlined />}>
                Search Button
            </Button>
        );

        const button = screen.getByTestId("btn-icon");
        expect(button.querySelector("svg")).toBeInTheDocument();
    });
});
