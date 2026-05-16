import { MapMarker } from "react-kakao-maps-sdk";
import type { MergedItem } from "../type/types";
import { useState } from "react";

type PointMarkerProps = {
  item: MergedItem;
  isSelected: boolean;
  onRoadSelect: (targegtRoadNumber: number) => void;
};
export default function PointMarker({
  item,
  isSelected,
  onRoadSelect,
}: PointMarkerProps) {
  const [isOver, setIsOver] = useState<boolean>(false);

  const onClick = () => onRoadSelect(item.ROAD_NO);

  return (
    <MapMarker
      position={{
        lat: Number(item.position.LAT),
        lng: Number(item.position.LOT),
      }}
      onClick={onClick}
      onMouseOver={() => {
        setIsOver(true);
      }}
      onMouseOut={() => {
        setIsOver(false);
      }}
    >
      {(isOver || isSelected) && (
        <span className="flex w-full h-full items-center justify-center text-xs whitespace-nowrap">
          {isSelected ? `[${item.ROAD_NO}]번길 : ` : ""}
          {item.BGNG_PSTN}
        </span>
      )}
    </MapMarker>
  );
}
