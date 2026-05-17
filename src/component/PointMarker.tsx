import { MapMarker } from "react-kakao-maps-sdk";
import type { MergedItem } from "../type/geoTypes";
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
        lat: item.position.lat,
        lng: item.position.lng,
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
          {`[${item.ROAD_NO}]${item.ROAD_NM}길 시작지점: ${item.BGNG_PSTN}`}
        </span>
      )}
    </MapMarker>
  );
}
