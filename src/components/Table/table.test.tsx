import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { Table } from "./index";
import type { TableColumn } from "./index";
import { mockColumns, mockData } from "../../mocks";


describe("Table component", () => {
    beforeAll(() => {
        // workaround https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addListener: vi.fn(), // Deprecated
                removeListener: vi.fn(), // Deprecated
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });
    });
    it("renders with the correct dataTestId", () => {
        render(
            <Table
                dataTestId="table-test"
                columns={mockColumns}
                data={mockData}
            />
        );
        expect(screen.getByTestId("table-test")).toBeInTheDocument();
    });

    it("renders table headers correctly", () => {
        render(
            <Table
                dataTestId="table-headers"
                columns={mockColumns}
                data={mockData}
            />
        );

        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Age")).toBeInTheDocument();
        expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("renders table data correctly", () => {
        render(
            <Table
                dataTestId="table-data"
                columns={mockColumns}
                data={mockData}
            />
        );

        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
        expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
        expect(screen.getByText("30")).toBeInTheDocument();
        expect(screen.getByText("25")).toBeInTheDocument();
        expect(screen.getByText("35")).toBeInTheDocument();
    });

    it("renders with custom rowKey", () => {
        const customData = [
            { customId: 1, name: "Test" },
            { customId: 2, name: "Test2" },
        ];
        const customColumns: TableColumn[] = [
            { key: "name", title: "Name", dataIndex: "name" },
        ];

        render(
            <Table
                dataTestId="table-custom-rowkey"
                columns={customColumns}
                data={customData}
                rowKey="customId"
            />
        );

        expect(screen.getByText("Test")).toBeInTheDocument();
        expect(screen.getByText("Test2")).toBeInTheDocument();
    });

    it("renders custom column render function", () => {
        const customColumns: TableColumn[] = [
            {
                key: "name",
                title: "Name",
                dataIndex: "name",
                render: (value) => <span data-testid="custom-render">{value.toUpperCase()}</span>,
            },
        ];
        render(
            <Table
                dataTestId="table-custom-render"
                columns={customColumns}
                data={mockData}
            />
        );

        expect(screen.getByTestId("table-custom-render")).toHaveTextContent("JOHN DOE");
    });

    it("handles empty data array", () => {
        render(
            <Table
                dataTestId="table-empty"
                columns={mockColumns}
                data={[]}
            />
        );

        expect(screen.getByTestId("table-empty")).toBeInTheDocument();
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("Age")).toBeInTheDocument();
        expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("renders with default pagination when not provided", () => {
        render(
            <Table
                dataTestId="table-default-pagination"
                columns={mockColumns}
                data={mockData}
            />
        );

        expect(screen.getByText(/1-3 of 3 items/)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "right" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "left" })).toBeInTheDocument();
    });

    it("renders without pagination when pagination is false", () => {
        render(
            <Table
                dataTestId="table-no-pagination"
                columns={mockColumns}
                data={mockData}
                pagination={false}
            />
        );

        expect(screen.queryByText(/of \d+ items/)).not.toBeInTheDocument();
    });

    it("renders with pagination when provided", () => {
        render(
            <Table
                dataTestId="table-with-pagination"
                columns={mockColumns}
                data={mockData}
                pagination={{
                    current: 1,
                    pageSize: 2,
                    total: 3,
                    onChange: vi.fn(),
                }}
            />
        );

        expect(screen.getByText("1-2 of 3 items")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();

    });

    it("calls onChange when page is clicked", () => {
        const onChange = vi.fn();

        render(
            <Table
                dataTestId="table-page-change"
                columns={mockColumns}
                data={mockData}
                pagination={{
                    current: 1,
                    pageSize: 2,
                    total: 3,
                    onChange: onChange,
                }}
            />
        );

        const page2Button = screen.getByRole("button", { name: "2" });
        fireEvent.click(page2Button);

        expect(onChange).toHaveBeenCalledWith(2, 2);
    });

    // it("handles page size change", () => {
    //     const onChange = vi.fn();

    //     render(
    //         <Table
    //             dataTestId="table-page-size-change"
    //             columns={mockColumns}
    //             data={mockData}
    //             onChange={onChange}
    //         />
    //     );


    //     const pageSizeSelector = screen.getByText("10 / page");
    //     fireEvent.click(pageSizeSelector);
    //     const pageSize20 = screen.getByText("20 / page");
    //     fireEvent.click(pageSize20);


    //     expect(onChange).toHaveBeenCalledWith(1, 20);
    // });

    it("disables previous button on first page", () => {
        const pagination = {
            current: 1,
            pageSize: 2,
            total: 3,
            onChange: vi.fn(),
        };

        render(
            <Table
                dataTestId="table-prev-disabled"
                columns={mockColumns}
                data={mockData}
                pagination={pagination}
            />
        );

        const prevButton = screen.getByRole("button", { name: /left/i });
        expect(prevButton).toBeDisabled();
    });

    it("disables next button on last page", () => {
        const pagination = {
            current: 2,
            pageSize: 2,
            total: 3,
            onChange: vi.fn(),
        };

        render(
            <Table
                dataTestId="table-next-disabled"
                columns={mockColumns}
                data={mockData}
                pagination={pagination}
            />
        );

        const nextButton = screen.getByRole("button", { name: /right/i });
        expect(nextButton).toBeDisabled();
    });

    it("renders selection checkboxes when selectable is true", () => {
        render(
            <Table
                dataTestId="table-selectable"
                columns={mockColumns}
                data={mockData}
                selectable={true}
            />
        );

        const checkboxes = screen.getAllByRole("checkbox");
        expect(checkboxes).toHaveLength(4);
    });

    it("calls onSelectionChange when row is selected", () => {
        const onSelectionChange = vi.fn();

        render(
            <Table
                dataTestId="table-selection"
                columns={mockColumns}
                data={mockData}
                selectable={true}
                onSelectionChange={onSelectionChange}
            />
        );

        const firstRowCheckbox = screen.getAllByRole("checkbox")[1];
        fireEvent.click(firstRowCheckbox);

        expect(onSelectionChange).toHaveBeenCalledWith([0], [mockData[0]]);
    });

    it("calls onSelectionChange when all rows are selected", () => {
        const onSelectionChange = vi.fn();

        render(
            <Table
                dataTestId="table-select-all"
                columns={mockColumns}
                data={mockData}
                selectable={true}
                onSelectionChange={onSelectionChange}
            />
        );

        const headerCheckbox = screen.getAllByRole("checkbox")[0];
        fireEvent.click(headerCheckbox);

        expect(onSelectionChange).toHaveBeenCalledWith([0, 1, 2], mockData);
    });

    it("handles sorting when column is clicked", () => {
        const customColumns: TableColumn[] = [
            {
                key: "name",
                title: "Name",
                dataIndex: "name",
                sortable: true,
            },
        ];
        render(
            <Table
                dataTestId="table-sorting"
                columns={customColumns}
                data={mockData}
            />
        );

        const nameHeader = screen.getByText("Name");
        fireEvent.click(nameHeader);

        const rows = screen.getAllByRole("row");
        expect(rows[1]).toHaveTextContent("Bob Johnson");
        expect(rows[2]).toHaveTextContent("Jane Smith");
        expect(rows[3]).toHaveTextContent("John Doe");
    });

    it("toggles sort direction when same column is clicked twice", async () => {

        const customColumns: TableColumn[] = [
            {
                key: "name",
                title: "Name",
                dataIndex: "name",
                sortable: true,
            },
        ];
        render(
            <Table
                dataTestId="table-sort-toggle"
                columns={customColumns}
                data={mockData}
            />
        );

        const nameHeader = screen.getByText("Name");
        const rows = screen.getAllByRole("row");


        fireEvent.click(nameHeader);

        const nameHeader2 = screen.getByText("Name");

        expect(rows[1]).toHaveTextContent("Bob Johnson");

        fireEvent.click(nameHeader2);

        expect(rows[1]).toHaveTextContent("John Doe");
    });

    it("only shows sort indicators for sortable columns", () => {
        const customColumns: TableColumn[] = [
            {
                key: "name",
                title: "Name",
                dataIndex: "name",
                sortable: true,
            },
            {
                key: "age",
                title: "Age",
                dataIndex: "age",
                sortable: true,
            },
            {
                key: "email",
                title: "Email",
                dataIndex: "email",
                sortable: false,
            },
        ];
        render(
            <Table
                dataTestId="table-sort-indicators"
                columns={customColumns}
                data={mockData}
            />
        );

        const nameHeader = screen.getByText("Name").parentElement;
        const ageHeader = screen.getByText("Age").parentElement;
        const emailHeader = screen.getByText("Email").parentElement;

        expect(nameHeader?.querySelector("span")).toBeInTheDocument();
        expect(ageHeader?.querySelector("span")).toBeInTheDocument();
        expect(emailHeader?.querySelector("span")).not.toBeInTheDocument();
    });

    it("handles custom page size options", () => {
        const pagination = {
            current: 1,
            pageSize: 10,
            total: 3,
            onChange: vi.fn(),
            showSizeChanger: true,
            pageSizeOptions: ["3", "33", "333"],
        };

        render(
            <Table
                dataTestId="table-custom-page-sizes"
                columns={mockColumns}
                data={mockData}
                pagination={pagination}
            />
        );

        const pageSizeSelect = screen.getByText("10 / page");
        fireEvent.mouseDown(pageSizeSelect);

        expect(screen.getByText("3 / page")).toBeInTheDocument();
        expect(screen.getByText("33 / page")).toBeInTheDocument();
        expect(screen.getByText("333 / page")).toBeInTheDocument();
    });

    it("hides page size changer when showSizeChanger is false", () => {
        const pagination = {
            current: 1,
            pageSize: 2,
            total: 3,
            onChange: vi.fn(),
            showSizeChanger: false,
        };

        render(
            <Table
                dataTestId="table-no-size-changer"
                columns={mockColumns}
                data={mockData}
                pagination={pagination}
            />
        );

        expect(screen.queryByDisplayValue("2 / page")).not.toBeInTheDocument();
    });
});
