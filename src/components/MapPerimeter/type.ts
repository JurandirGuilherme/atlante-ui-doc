interface LatLng {
  lat: number;
  lng: number;
}
interface MapPerimeterProps {
  value?: LatLng[];
  onChange?: TypeOnChangePoints;
}
export type TypeOnChangePoints = (points: LatLng[]) => void;

export type { LatLng, MapPerimeterProps };
