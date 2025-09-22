/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React from "react";
import { MapContainer, TileLayer, Polygon, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css"; 
import { LatLng, MapPerimeterProps } from "./type";

const MapPerimeter: React.FC<MapPerimeterProps> = ({
  value = [],
  onChange,
}) => {
  const ClickHandler = ({
    onAddPoint,
  }: {
    onAddPoint: ({ lat, lng }: { lat: number; lng: number }) => void;
  }) => {
    useMapEvents({
      click(e: any) {
        onAddPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
      },
    });
    return null;
  };

  const handleAddPoint = (point: LatLng) => {
    if (value.length < 4) {
      const newPoints = [...value, point];
      onChange?.(newPoints);
    }
  };

  
  return (
    <>
      <MapContainer
        {...{ zoom: 13, center: [-8.05, -34.9], }}
        style={{ height: "400px", width: "100%" , zIndex:0}}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClickHandler onAddPoint={handleAddPoint} />
        {value.length > 0 && (
          <Polygon
            positions={value.length === 4 ? [...value, value[0]] : value}
          />
        )}
      </MapContainer>
    </>
  );
};

export default MapPerimeter;
