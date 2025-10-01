"use client";

import React, { useState } from "react";
import { Card, Button as ButtonAntd } from "antd";
import { CodeOutlined } from "@ant-design/icons";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { CardComponentsProps } from "./type";
import { scope } from "./data";

export default function CardComponents({
  code,
  title,
  description,
}: CardComponentsProps) {
  const [showCode, setShowCode] = useState(false);

  // if (!window) return <></>
  return (
    <LiveProvider code={code.trim()} scope={scope}>
      <Card
        title={title}
        style={{ marginBottom: 24, marginTop: 20 }}
        actions={[
          <>
            <ButtonAntd
              type="text"
              icon={<CodeOutlined />}
              onClick={() => setShowCode(!showCode)}
            >
              {showCode ? "Hide code" : "Show code"}
            </ButtonAntd>
          </>,
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <LivePreview />
        </div>

        {/* {description && <p style={{ marginBottom: 16 }}>{description}</p>} */}
      </Card>
      {showCode && (
        <>
          <LiveEditor
            style={{
              borderRadius: 8,
              fontSize: 14,
              marginBottom: 12,
            }}
          />
          <LiveError style={{ color: "red", fontSize: 13 }} />
        </>
      )}
    </LiveProvider>
  );
}
