import { Map } from "react-kakao-maps-sdk";
import type { PathItem, PointItem, MergedItem } from "../type/types";
import PointMarker from "./PointMarker";
import MapMarkerSet from "./MarkerSet";
import { LocateFixed, Plus, Minus } from "lucide-react";
import { useRef, useState } from "react";

type MainMapProps = {
  points: PointItem[];
  paths: PathItem[];
  infos: MergedItem[];
  selectedRoad: number | null;
  onRoadSelect: (targetRoadNumber: number) => void;
};

export default function MainMap({
  points,
  paths,
  infos,
  selectedRoad,
  onRoadSelect,
}: MainMapProps) {
  // console.log("MAIN MAP POINTS: ", points);
  // console.log("MAIN MAP PATHS: ", paths);
  // console.log("MAIN MAP INFOS: ", infos);

  const seoulCenter = {
    lat: 37.5665,
    lng: 126.978,
  };

  const mapRef = useRef<kakao.maps.Map>(null);
  const [center, setCenter] = useState(seoulCenter);

  const zoomIn = () => {
    const map = mapRef.current;
    if (!map) return;
    map.setLevel(map.getLevel() - 1);
  };

  const zoomOut = () => {
    const map = mapRef.current;
    if (!map) return;
    map.setLevel(map.getLevel() + 1);
  };

  const onMyLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  };

  return (
    <div>
      {/* 지도 */}
      <Map
        center={center}
        isPanto={true}
        className="w-screen h-screen"
        level={9}
        ref={mapRef}
      >
        {infos.map((i) => (
          // <PointMarker
          //   key={i.ROAD_NO}
          //   item={i}
          //   onRoadSelect={onRoadSelect}
          //   isSelected={i.ROAD_NO === selectedRoad}
          // />
          <MapMarkerSet
            key={i.ROAD_NO}
            item={i}
            onRoadSelect={onRoadSelect}
            isSelected={i.ROAD_NO === selectedRoad}
          />
        ))}
      </Map>
      {/* 줌버튼 */}
      <div className="absolute z-20 bottom-26 right-4 flex flex-col bg-white rounded-sm shadow-md">
        <button
          className="flex h-10 w-10 items-center justify-center border-b border-b-gray-200"
          onClick={() => zoomIn}
        >
          <Plus size={20} strokeWidth={2.5} />
        </button>
        <button
          className="flex h-10 w-10 items-center justify-center"
          onClick={() => zoomOut}
        >
          <Minus size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* 내 위치 버튼 */}
      <div className="absolute z-20 bottom-14 right-4">
        <button
          onClick={onMyLocation}
          className="flex h-10 w-10 items-center justify-center bg-white rounded-sm shadow-md"
        >
          <LocateFixed size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

{
  /* <Polyline
        path={[
          [
            { lat: 33.452344169439975, lng: 126.56878163224233 },
            { lat: 33.452739313807456, lng: 126.5709308145358 },
            { lat: 33.45178067090639, lng: 126.572688693875 },
          ],
        ]}
        strokeWeight={5} // 선의 두께 입니다
        strokeColor={"#FFAE00"} // 선의 색깔입니다
        strokeOpacity={0.7} // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle={"solid"} // 선의 스타일입니다
      /> */
}
