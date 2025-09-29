import React from "react";
import { Input as AntdInput, InputProps as AntdInputProps } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";

export interface InputProps extends Omit<AntdInputProps, "style"> {
    dataTestId: string;
    style?: React.CSSProperties;
}

export const Input: React.FC<InputProps> = ({
    dataTestId,
    style,
    type,
    ...rest
}) => {
    const inputStyle: React.CSSProperties = {
        ...style,
        borderRadius: "2px",
        border: "1px solid #D9D9D9",
        width: "100%",
    };

    if (type === "password") {
        return (
            <AntdInput.Password
                data-testid={dataTestId}
                style={inputStyle}
                iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                {...rest}
            />
        );
    }

    return (
        <AntdInput
            data-testid={dataTestId}
            style={inputStyle}
            type={type}
            {...rest}
        />
    );
};
