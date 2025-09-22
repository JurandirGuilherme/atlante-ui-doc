"use client";
import { Button, Form } from "antd";
import MapPerimeter from "@/components/MapPerimeter";
import { useState } from "react";
import { LatLng } from "@/components/MapPerimeter/type";

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
