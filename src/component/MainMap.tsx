import { Map, MapTypeId, Polyline } from "react-kakao-maps-sdk";
import type { Position } from "../type/geoTypes";
import MapMarkerSet from "./MarkerSet";
import { useContext, useEffect, useRef, useState } from "react";
import ZoomButtons from "./ZoomButtons";
import MyLocationButton from "./MyLocationButton";
import MyLocationMarker from "./MyLocationMarker";
import { parseGeoJson } from "../util/parseGeoJson";
import FilterButtons from "./FilterButtons";
import { SEOUL_CENTER } from "../data/seoulCenter";
import { TrailStateContext } from "../context/TrailStateContext";
import { TrailDispatchContext } from "../context/TrailDispatchContext";

// 업데이트, fetch 가능성이 없으므로 컴포넌트 외부에서 데이터를 가공한다.
// 컴포넌트 라이프사이클과 무관하게 된다.
const polyLines: Position[][][] = parseGeoJson();

export default function MainMap() {
  const { infos, selectedRoad, selectedLevel, mapResetCount } =
    useContext(TrailStateContext);
  const { onRoadSelect, onLevelChange } = useContext(TrailDispatchContext);
  // 지도를 조작하기 위해 필요
  const mapRef = useRef<kakao.maps.Map>(null);

  // 지도 렌더링 관련 state
  const [center, setCenter] = useState<Position>(SEOUL_CENTER);
  const [mapLevel, setMapLevel] = useState<number>(9);
  const [isMyLocation, setIsMyLocation] = useState<boolean>(false);
  const [myLocation, setMyLocation] = useState<Position>(center);

  const zoomIn = () => {
    const map = mapRef.current;
    if (!map) return;
    map.setLevel(map.getLevel() - 1, { animate: true });
  };

  const zoomOut = () => {
    const map = mapRef.current;
    if (!map) return;
    map.setLevel(map.getLevel() + 1, { animate: true });
  };

  const onMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCenter(newPosition);
        setMyLocation(newPosition);
        setIsMyLocation(true);
      },
      (error) => {
        console.error("위치 정보를 가져오는데 실패했습니다.", error);
      },
    );
  };

  const onDragEnd = () => {
    const map = mapRef.current;
    if (!map) return;

    const curLat = map.getCenter().getLat();
    const curLng = map.getCenter().getLng();

    const isMoved =
      Math.abs(curLat - myLocation.lat) > 0.05 ||
      Math.abs(curLng - myLocation.lng) > 0.05;

    if (isMoved && isMyLocation) {
      setIsMyLocation(false);
    }
  };

  const onZoomChanged = () => {
    const map = mapRef.current;
    if (!map) return;
    setMapLevel(map.getLevel());
  };

  // 지도 초기화
  useEffect(() => {
    // 카카오맵은 실제 지도 조작과 state 관리를 분리해야 함
    const map = mapRef.current;
    if (!map) return;

    const seoulLatLng = new kakao.maps.LatLng(
      SEOUL_CENTER.lat,
      SEOUL_CENTER.lng,
    );

    map.setCenter(seoulLatLng);
    map.setLevel(9);

    setCenter(SEOUL_CENTER);
    setMapLevel(9);
    setIsMyLocation(false);
    setMyLocation(SEOUL_CENTER);
  }, [mapResetCount]); // 부모의 onAppInit이 실행되면 mapResetCount 값이 변경되고, 그것을 감지하여 지도를 초기화 한다.

  return (
    <div>
      <Map
        center={center}
        isPanto={true}
        className="w-screen h-screen"
        level={mapLevel}
        ref={mapRef}
        zoomable={false}
        onZoomChanged={onZoomChanged}
        onDragEnd={onDragEnd}
      >
        {infos.map((i) => (
          <MapMarkerSet
            key={i.ROAD_NO}
            item={i}
            onRoadSelect={onRoadSelect}
            isSelected={i.ROAD_NO === selectedRoad}
            selectedLevel={selectedLevel}
          />
        ))}
        {isMyLocation && <MyLocationMarker position={myLocation} />}
        {polyLines &&
          polyLines.map((positions, index) => (
            <Polyline
              key={index}
              path={positions}
              strokeWeight={4}
              strokeColor={"oklch(51.1% 0.262 276.966)"}
              strokeOpacity={0.7}
              strokeStyle={"solid"}
            />
          ))}
        <MapTypeId type={"TERRAIN"} />
      </Map>
      <ZoomButtons zoomIn={zoomIn} zoomOut={zoomOut} />
      <MyLocationButton onMyLocation={onMyLocation} />
      <FilterButtons onLevelChange={onLevelChange} />
    </div>
  );
}
