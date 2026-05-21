import { Map, MapTypeId, Polyline } from "react-kakao-maps-sdk";
import type { Position } from "../type/geoTypes";
import MarkerSet from "./MarkerSet";
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
  const { infos, selectedRoad, selectedLevel, isSideBarOpen, mapResetCount } =
    useContext(TrailStateContext);
  const { onRoadSelect, onLevelChange } = useContext(TrailDispatchContext);
  // 지도를 조작하기 위해 필요
  const mapRef = useRef<kakao.maps.Map>(null);
  const map = mapRef.current;
  if (!map) return;

  // 지도 렌더링 관련 state
  const [center, setCenter] = useState<Position>(SEOUL_CENTER);
  const [mapLevel, setMapLevel] = useState<number>(9);
  const [isMyLocation, setIsMyLocation] = useState<boolean>(false);
  const [myLocation, setMyLocation] = useState<Position>(center);

  const zoomIn = () => {
    // const map = mapRef.current;
    // if (!map) return;
    map.setLevel(map.getLevel() - 1, { animate: true });
  };

  const zoomOut = () => {
    // const map = mapRef.current;
    // if (!map) return;
    map.setLevel(map.getLevel() + 1, { animate: true });
  };

  const onMyLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // const map = mapRef.current;
        // if (!map) return;
        const newLatLng = new kakao.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude,
        );
        (map as any).jump(newLatLng, 7, { animate: true });
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
    // const map = mapRef.current;
    // if (!map) return;

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
    // const map = mapRef.current;
    // if (!map) return;
    setMapLevel(map.getLevel());
  };

  // 지도 초기화
  useEffect(() => {
    // 카카오맵은 실제 지도 조작과 state 관리를 분리해야 함
    // const map = mapRef.current;
    // if (!map) return;

    const seoulLatLng = new kakao.maps.LatLng(
      SEOUL_CENTER.lat,
      SEOUL_CENTER.lng,
    );

    // map.setCenter(seoulLatLng);
    // map.setLevel(9);

    // 카카오맵에서 setCenter를 하고, setLevel을 하면 애니메이션 에러가 남.
    // 카카오맵 원본 API에서 둘을 한꺼번에 처리할 수 있는 jump 기능을 추가해 줌.
    // react 라이브러리에서 jump 메서드가 추가되어 있지 않아, 임시방편으로 type any로 단언하여 사용중
    (map as any).jump(seoulLatLng, 9, { animate: true });

    setCenter(SEOUL_CENTER);
    setMapLevel(9);
    setIsMyLocation(false);
    setMyLocation(SEOUL_CENTER);
  }, [mapResetCount]); // 부모의 onAppInit이 실행되면 mapResetCount 값이 변경되고, 그것을 감지하여 지도를 초기화 한다.

  useEffect(() => {
    // const map = mapRef.current;
    // if (!map) return;

    const selectedRoadItem = infos.find(
      (item) => item.ROAD_NO === selectedRoad,
    );

    const newLatLng = new kakao.maps.LatLng(
      selectedRoadItem!.position.lat,
      selectedRoadItem!.position.lng,
    );

    const newPosition = {
      lat: selectedRoadItem!.position.lat,
      lng: selectedRoadItem!.position.lng,
    };

    (map as any).jump(newLatLng, 8, { animate: true });
    setCenter(newPosition);
    setMapLevel(8);
    setIsMyLocation(false);
  }, [selectedRoad]);

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
          <MarkerSet
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
