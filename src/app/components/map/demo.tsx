"use client";
import { Button, Form } from "antd";
import { useState } from "react";
import { LatLng } from "@/components/MapPerimeter/type";
import dynamic from "next/dynamic";

const MapPerimeter = dynamic(() => import("@/components/MapPerimeter"), {
  ssr: false,
});

export default function Demo() {
  const [form] = Form.useForm();
  const [points, setPoints] = useState<LatLng[]>([]);

  return (
    <Form form={form}>
      <Form.Item
        name="perimeter"
        label="Perímetro"
        labelCol={{ style: { display: "none" } }}
      >
        <MapPerimeter value={points} onChange={setPoints} />
        <Button
          style={{ marginTop: "10px" }}
          onClick={() => {
            setPoints([]);
          }}
        >
          Limpar Pontos
        </Button>
      </Form.Item>
    </Form>
  );
}
