import { Map } from "react-kakao-maps-sdk";
import type { PathItem, PointItem, MergedItem } from "../type/types";
import PointMarker from "./PointMarker";

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
  console.log("MAIN MAP POINTS: ", points);
  console.log("MAIN MAP PATHS: ", paths);
  console.log("MAIN MAP INFOS: ", infos);

  const seoulCenter = {
    lat: 37.5665,
    lng: 126.978,
  };

  return (
    <Map center={seoulCenter} className="w-screen h-screen" level={9}>
      {infos.map((i) => (
        <PointMarker
          key={i.ROAD_NO}
          item={i}
          onRoadSelect={onRoadSelect}
          isSelected={i.ROAD_NO === selectedRoad}
        />
      ))}
    </Map>
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
