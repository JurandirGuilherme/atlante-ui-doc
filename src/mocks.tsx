import { TableColumn } from "@atlante-ti/atlante-ui";

export const mockColumns: TableColumn[] = [
    { key: "name", title: "Name", dataIndex: "name" },
    { key: "age", title: "Age", dataIndex: "age" },
    { key: "email", title: "Email", dataIndex: "email" },
];

export const mockData = [
    { name: "John Doe", age: 30, email: "john.doe@example.com" },
    { name: "Jane Smith", age: 25, email: "jane.smith@example.com" },
    { name: "Bob Johnson", age: 35, email: "bob.johnson@example.com" },
];