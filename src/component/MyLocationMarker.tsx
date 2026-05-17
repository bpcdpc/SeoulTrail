import { CustomOverlayMap } from "react-kakao-maps-sdk";
import type { Position } from "../type/geoTypes";

type MyLocationMarkerProps = {
  position: Position;
};
export default function MyLocationMarker({ position }: MyLocationMarkerProps) {
  return (
    <CustomOverlayMap
      position={{
        lat: position.lat,
        lng: position.lng,
      }}
      yAnchor={0.5}
      zIndex={50}
    >
      <span className="relative flex size-3">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-500 opacity-75"></span>
        <span className="relative inline-flex size-3 rounded-full bg-indigo-600"></span>
      </span>
    </CustomOverlayMap>
  );
}

// ring-4 ring-indigo-100
