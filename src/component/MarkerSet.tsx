import { CustomOverlayMap } from "react-kakao-maps-sdk";
import type { MergedItem } from "../type/geoTypes";
import React, { useState } from "react";
import { setLevelClassName } from "../util/miscFunctions";

type MapMarkerSetProps = {
  item: MergedItem;
  isSelected: boolean;
  selectedLevel: string;
  onRoadSelect: (targetRoadNumber: number) => void;
};

const MapMarkerSet = ({
  item,
  isSelected,
  selectedLevel,
  onRoadSelect,
}: MapMarkerSetProps) => {
  const [isOver, setIsOver] = useState<boolean>(false);

  const onClick = () => onRoadSelect(item.ROAD_NO);

  const isActivated: Boolean = isOver || isSelected;
  const isFiltered: Boolean = selectedLevel === item.LV_KORN;
  const overlayZIndex: number = isOver
    ? 50
    : isSelected || isFiltered
      ? 30
      : 10;

  let markerStyles =
    "w-8 h-8 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md hover:scale-110";

  if (isSelected && isFiltered) {
    // 선택된 마커이면서 필터링된 마커 (최우선 순위)
    markerStyles += ` ${setLevelClassName(item.LV_KORN)} scale-110 ring-4 ring-indigo-200`;
  } else if (isSelected) {
    // 선택된 마커
    markerStyles += " bg-indigo-600 scale-110 ring-4 ring-indigo-200";
  } else if (isFiltered) {
    // 필터링된 마커
    markerStyles += ` ${setLevelClassName(item.LV_KORN)}`;
  } else if (selectedLevel !== "") {
    // 필터링에서 제외된 마커
    markerStyles += " bg-zinc-400 opacity-0.9 hover:bg-blue-500";
  } else {
    // 기본 마커
    markerStyles += " bg-blue-400 text-white hover:bg-blue-500";
  }

  return (
    <CustomOverlayMap
      position={{
        lat: item.position.lat,
        lng: item.position.lng,
      }}
      yAnchor={0.5} // 마커의 중심을 기준점으로 설정
      zIndex={overlayZIndex}
    >
      <div
        className="relative flex flex-col items-center"
        onMouseEnter={() => setIsOver(true)}
        onMouseLeave={() => setIsOver(false)}
      >
        {/* InfoWindow */}
        {isActivated && (
          <div
            className="absolute bottom-10 z-50 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-xl border border-gray-100 min-w-3 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className={`text-xs font-semibold text-blue-600 ${
                isSelected ? "text-indigo-600" : "text-blue-600"
              }`}
            >
              {item.ROAD_NM}길
            </p>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100" />
          </div>
        )}

        {/* Marker */}
        <div className={markerStyles} onClick={onClick}>
          <span className="text-xs text-white font-bold">{item.ROAD_NO}</span>
        </div>
      </div>
    </CustomOverlayMap>
  );
};

export default React.memo(MapMarkerSet);
