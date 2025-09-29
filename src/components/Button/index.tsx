import React from "react";
import { Button as AntdButton, ButtonProps as AntdButtonBaseProps } from "antd";

export interface ButtonProps
  extends Omit<AntdButtonBaseProps, "type" | "variant"> {
  children?: React.ReactNode;
  variant?: "primary" | "default" | "secondary";
  dataTestId?: string;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  style,
  icon,
  dataTestId,
  ...rest
}) => {
  const getButtonStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      borderRadius: "6px",
      ...style,
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: "#181A4A",
          color: "#FFFFFF",
          border: "none",
        };
      case "default":
        return {
          ...baseStyle,
          backgroundColor: "#FFFFFF",
          color: "#000000",
          border: "1px solid #D9D9D9",
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: "#F5F5F5",
          color: "#181A4A",
          border: "1px solid #D9D9D9",
        };
      default:
        return baseStyle;
    }
  };

  return (
    <AntdButton
      onClick={onClick}
      style={getButtonStyle()}
      icon={icon}
      data-testid={dataTestId}
      {...rest}
    >
      {children || null}
    </AntdButton>
  );
};
