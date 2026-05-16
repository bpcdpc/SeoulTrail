import { CustomOverlayMap } from "react-kakao-maps-sdk";
import type { MergedItem } from "../type/types";
import { useState } from "react";

type MapMarkerSetProps = {
  item: MergedItem;
  isSelected: boolean;
  onRoadSelect: (targetRoadNumber: number) => void;
};

export default function MapMarkerSet({
  item,
  isSelected,
  onRoadSelect,
}: MapMarkerSetProps) {
  const [isOver, setIsOver] = useState<boolean>(false);

  const onClick = () => onRoadSelect(item.ROAD_NO);

  const isActivated: Boolean = isOver || isSelected;
  const overlayZIndex: number = isOver ? 50 : isSelected ? 30 : 10; // 마우스오버가 가장 위에 보이도록

  return (
    <CustomOverlayMap
      position={{
        lat: Number(item.position.LAT),
        lng: Number(item.position.LOT),
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
            className="absolute bottom-10 z-50 bg-white text-gray-800 px-3 py-2 rounded-lg shadow-xl border border-gray-100 min-w-40 pointer-events-none"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-xs font-semibold text-indigo-600">
              {item.BGNG_PSTN}
            </p>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-gray-100" />
          </div>
        )}

        {/* Marker */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md
            ${
              isSelected
                ? "bg-indigo-600 text-white scale-110 ring-4 ring-indigo-200"
                : "bg-white text-indigo-600 hover:bg-indigo-50 hover:scale-105"
            }`}
          onClick={onClick}
        >
          <span className="text-xs font-bold">{item.ROAD_NO}</span>
        </div>
      </div>
    </CustomOverlayMap>
  );
}
