import { MapMarker } from "react-kakao-maps-sdk";
import type { PointItem, MergedItem } from "../type/types";
import { useState } from "react";

type PointMarkerProps = {
  item: MergedItem;
};
export default function PointMarker({ item }: PointMarkerProps) {
  const [isOver, setIsOver] = useState<boolean>(false);
  return (
    <MapMarker
      position={{
        lat: Number(item.position.LAT),
        lng: Number(item.position.LOT),
      }}
      onClick={() => {
        console.log("Click");
      }}
      onMouseOver={() => {
        setIsOver(true);
      }}
      onMouseOut={() => {
        setIsOver(false);
      }}
    >
      {isOver && (
        <span className="flex w-full h-full items-center justify-center text-xs whitespace-nowrap">
          {item.BGNG_PSTN}
        </span>
      )}
    </MapMarker>
  );
}
