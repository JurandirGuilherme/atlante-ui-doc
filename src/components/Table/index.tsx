import React, { useMemo, useState } from "react";
import { Table as AntdTable, Checkbox, Select as AntdSelect, Button as AntdButton } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import type { ColumnsType, TableProps as AntdTableProps } from "antd/es/table";

export interface TableColumn<T = any> {
    key: string;
    title: string;
    dataIndex: string;
    sortable?: boolean;
    width?: number | string;
    style?: React.CSSProperties;
    render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface TableProps<T = any>
    extends Omit<AntdTableProps<T>, "columns" | "rowKey"> {
    columns: TableColumn<T>[];
    data: T[];
    selectable?: boolean;
    onSelectionChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    dataTestId?: string;
    style?: React.CSSProperties;
    rowKey?: keyof T | ((record: T) => React.Key);
}

const COLORS = {
    border: "#181A4A",
    primary: "#1890ff",
    text: "#000",
    textMuted: "#BFBFBF",
    bg: "#fff",
};

export const Table = <T extends Record<string, any>>({
    columns,
    data,
    selectable = false,
    onSelectionChange,
    pagination,
    dataTestId,
    style,
    rowKey,
    ...rest
}: TableProps<T>) => {
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);

    const tableStyle: React.CSSProperties = {
        ...style,
        borderRadius: "6px",
        border: `0px`,
    };

    const getKey = <T,>(
        record: T,
        rowKey?: keyof T | ((record: T) => React.Key),
        index?: number
    ) => {
        if (!rowKey) {
            const id = (record as any).id;
            return id !== undefined ? id : index;
        }
        return typeof rowKey === "function"
            ? rowKey(record)
            : (record as any)[rowKey];
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            const newKeys = data.map((record, index) => getKey(record, rowKey, index));
            setSelectedRowKeys(newKeys);
            onSelectionChange?.(newKeys, data);
        } else {
            setSelectedRowKeys([]);
            onSelectionChange?.([], []);
        }
    };

    const handleSelectRow = (checked: boolean, record: T) => {
        const recordIndex = data.findIndex((item) => item === record);
        const recordKey = getKey(record, rowKey, recordIndex);

        let newSelectedRowKeys: React.Key[];

        if (checked) {
            newSelectedRowKeys = [...selectedRowKeys, recordKey];
        } else {
            newSelectedRowKeys = selectedRowKeys.filter((k) => k !== recordKey);
        }

        const newSelectedRows = data.filter((record, index) =>
            newSelectedRowKeys.includes(getKey(record, rowKey, index))
        );

        setSelectedRowKeys(newSelectedRowKeys);
        onSelectionChange?.(newSelectedRowKeys, newSelectedRows);
    };

    const handleSort = (columnKey: string) => {
        const direction =
            sortConfig?.key === columnKey && sortConfig?.direction === "asc"
                ? "desc"
                : "asc";
        setSortConfig({ key: columnKey, direction });
    };

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue == null) return 1;
            if (bValue == null) return -1;

            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortConfig.direction === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    const antdColumns: ColumnsType<T> = [
        ...(selectable
            ? [
                {
                    title: (
                        <Checkbox
                            checked={(() => {
                                const allKeys = sortedData.map((record, index) =>
                                    getKey(record, rowKey, index)
                                );
                                return (
                                    allKeys.length > 0 &&
                                    allKeys.every((key) =>
                                        selectedRowKeys.includes(key)
                                    )
                                );
                            })()}
                            indeterminate={(() => {
                                const allKeys = sortedData.map((record, index) =>
                                    getKey(record, rowKey, index)
                                );
                                const selectedCount = allKeys.filter((key) =>
                                    selectedRowKeys.includes(key)
                                ).length;
                                return (
                                    selectedCount > 0 &&
                                    selectedCount < allKeys.length
                                );
                            })()}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                    ),
                    key: "selection",
                    width: 50,
                    render: (_: any, record: T, index: number) => {
                        const key = getKey(record, rowKey, index);
                        return (
                            <Checkbox
                                checked={selectedRowKeys.includes(key)}
                                onChange={(e) => handleSelectRow(e.target.checked, record)}
                            />
                        );
                    },
                },
            ]
            : []),
        ...columns.map((column) => ({
            ...column,
            title: (
                <div
                    onClick={() =>
                        column.sortable && handleSort(column.dataIndex)}
                    style={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "space-between", cursor: column.sortable ? "pointer" : "default" }}>
                    {column.title}
                    {column.sortable && (
                        <div
                            style={{
                                cursor: "pointer",
                                display: "flex",
                                flexDirection: "column",
                                fontSize: "10px",
                                color: COLORS.textMuted,
                            }}
                        >
                            <span
                                style={{
                                    color:
                                        sortConfig?.key === column.dataIndex &&
                                            sortConfig?.direction === "asc"
                                            ? COLORS.primary
                                            : "#ccc",
                                }}
                            >
                                ▲
                            </span>
                            <span
                                style={{
                                    color:
                                        sortConfig?.key === column.dataIndex &&
                                            sortConfig?.direction === "desc"
                                            ? COLORS.primary
                                            : "#ccc",
                                }}
                            >
                                ▼
                            </span>
                        </div>
                    )}
                </div>
            ),
        })),
    ];

    const getCustomPagination = (paginationConfig: any) => {
        if (paginationConfig === false) return false;

        const defaultPagination = {
            current: 1,
            pageSize: 10,
            total: paginationConfig?.total || data.length,
            showSizeChanger: true,
            pageSizeOptions: paginationConfig?.pageSizeOptions || ["10", "20", "50", "100"],
            showQuickJumper: false,
            showTotal: (total: number, range: [number, number]) => (
                <span style={{ color: '#262626', fontSize: "14px", marginRight: "16px" }}>
                    {range[0]}-{range[1]} of {total} items
                </span>
            ),
            itemRender: (page: number, type: string, originalElement: React.ReactNode) => {
                if (type === 'prev') {
                    return (
                        <AntdButton
                            icon={<LeftOutlined />}
                            style={{
                                border: `1px solid ${COLORS.textMuted}`,
                                borderRadius: "2px",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        />
                    );
                }
                if (type === 'next') {
                    return (
                        <AntdButton
                            icon={<RightOutlined />}
                            style={{
                                border: `1px solid ${COLORS.textMuted}`,
                                borderRadius: "2px",
                                width: "32px",
                                height: "32px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        />
                    );
                }
                if (type === 'page') {
                    const currentPage = paginationConfig?.current || 1;
                    return (
                        <AntdButton
                            type={page === currentPage ? "primary" : "default"}
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "2px",
                                fontWeight: page === currentPage ? "bold" : "normal",
                                border: page === currentPage ? `1px solid ${COLORS.border}` : `1px solid ${COLORS.textMuted}`,
                                backgroundColor: 'transparent',
                                color: page === currentPage ? COLORS.border : '#262626',
                            }}
                        >
                            {page}
                        </AntdButton>
                    );
                }
                return originalElement;
            },
            style: {
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: "16px",
                padding: "0 16px",
            },
            className: "custom-pagination"
        };

        return paginationConfig ? { ...defaultPagination, ...paginationConfig } : defaultPagination;
    };


    const headerCellStyle: React.CSSProperties = {
        padding: '8px 12px',
        height: '32px',
        lineHeight: '16px',
    };

    return (
        <div data-testid={dataTestId}>
            <style>
                {`
                    .custom-pagination .ant-pagination-item {
                        border: none !important;
                    }
                    .custom-pagination .ant-pagination-item-active {
                        border: none !important;
                    }
                    .custom-pagination .ant-pagination-options .ant-select {
                        height: 32px !important;
                    }
                    .custom-pagination .ant-pagination-options .ant-select .ant-select-selector {
                        height: 32px !important;
                        border-radius: 2px !important;
                        border: 1px solid ${COLORS.textMuted} !important;
                    }
                    .custom-pagination .ant-pagination-options .ant-select .ant-select-selection-item {
                        line-height: 30px !important;
                    }
                    .custom-pagination .ant-pagination-options .ant-select .ant-select-dropdown {
                        border-radius: 2px !important;
                    }
                    .custom-pagination .ant-pagination-options .ant-select .ant-select-dropdown .ant-select-dropdown-content {
                        border-radius: 2px !important;
                    }
                `}
            </style>
            <AntdTable
                columns={antdColumns}
                dataSource={sortedData}
                pagination={getCustomPagination(pagination)}
                style={tableStyle}
                rowKey={rowKey || "id"}
                components={{
                    header: {
                        cell: (props: any) => (
                            <th {...props} style={{ ...props.style, ...headerCellStyle }}>
                                {props.children}
                            </th>
                        ),
                    },
                }}
                {...rest}
            />
        </div>
    );
};
