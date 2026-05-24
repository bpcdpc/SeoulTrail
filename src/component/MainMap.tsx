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

  // 지도 렌더링 관련 state
  const [isMyLocation, setIsMyLocation] = useState<boolean>(false);
  const [myLocation, setMyLocation] = useState<Position>(SEOUL_CENTER);

  // 지도 객체 널 체크 루틴
  // 모든 지도 조작 루틴은 map 객체가 확인된 후에 진행하는 것이 좋으므로
  // withMap 콜백 안에서 진행하는 것이 좋다.
  const withMap = (action: (map: kakao.maps.Map) => void) => {
    const map = mapRef.current;
    if (!map) return;
    action(map);
  };

  // 사이드바가 펼쳐졌는지 감지해서 오프셋 위경도 계산해주는 함수.
  // 카카오맵에서 레벨과 센터를 동시에 변경하려면
  // jump 메쏘드로 한번에 호출해야 해서, 메쏘드 호출 전에 오프셋 다 계산해서 넘겨줘야 함.
  const calcOffsetLng = (targetLevel: number): number => {
    let offsetLng = 0;
    if (isSideBarOpen) {
      withMap((map) => {
        // 현재 지도의 중심점을 왼쪽으로 200px 밀었을 때의 좌표를 구해서
        const projection = map.getProjection();
        const centerLatLng = map.getCenter();
        const centerPoint = projection.containerPointFromCoords(centerLatLng);
        centerPoint.x -= 200;
        const newLatLng = projection.coordsFromContainerPoint(centerPoint);

        // 현재 좌표와의 경도 차이 계산
        const diffX = newLatLng.getLng() - centerLatLng.getLng();

        // 목표 레벨과 현재 레벌의 단계 차이에 따라 2의 지수만큼 곱해서 변한 정도를 계산
        const curLevel = map.getLevel();
        const targetDeltaX = diffX * 2 ** (targetLevel - curLevel);

        offsetLng = targetDeltaX;
      });
    }
    return offsetLng;
  };

  const zoomIn = () => {
    withMap((map) => {
      map.setLevel(map.getLevel() - 1, { animate: true });
    });
  };

  const zoomOut = () => {
    withMap((map) => {
      map.setLevel(map.getLevel() + 1, { animate: true });
    });
  };

  const onMyLocation = () => {
    withMap((map) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLatLng = new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude,
          );

          const newPosition = {
            lat: newLatLng.getLat(),
            lng: newLatLng.getLng(),
          };
          setMyLocation(newPosition);
          setIsMyLocation(true);

          const offsetLatLng = new kakao.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude + calcOffsetLng(8),
          );

          (map as any).jump(offsetLatLng, 8, { animate: true });
        },
        (error) => {
          console.error("위치 정보를 가져오는데 실패했습니다.", error);
        },
      );
    });
  };

  const onDragEnd = () => {
    withMap((map) => {
      const curCenter = map.getCenter();
      const curLat = curCenter.getLat();
      const curLng = curCenter.getLng();

      const isMoved =
        Math.abs(curLat - myLocation.lat) > 0.05 ||
        Math.abs(curLng - myLocation.lng) > 0.05;

      if (isMoved && isMyLocation) {
        setIsMyLocation(false);
      }
    });
  };

  const onMapInit = () => {
    withMap((map) => {
      // 카카오맵은 실제 지도 조작과 state 관리를 분리해야 함
      const seoulLatLng = new kakao.maps.LatLng(
        SEOUL_CENTER.lat,
        SEOUL_CENTER.lng,
      );

      // 카카오맵에서 setCenter를 하고, setLevel을 하면 애니메이션 에러가 남.
      // 카카오맵 원본 API에서 둘을 한꺼번에 처리할 수 있는 jump 기능을 추가해 줌.
      // react 라이브러리에서 jump 메서드가 추가되어 있지 않아, 임시방편으로 type any로 단언하여 사용중
      (map as any).jump(seoulLatLng, 9, { animate: true });
      setIsMyLocation(false);
    });
  };

  const onMarkerSelected = () => {
    const selectedRoadItem = infos.find(
      (item) => item.ROAD_NO === selectedRoad,
    );
    if (selectedRoadItem) {
      withMap((map) => {
        let newLatLng = new kakao.maps.LatLng(
          selectedRoadItem.position.lat,
          selectedRoadItem.position.lng + calcOffsetLng(8),
        );

        (map as any).jump(newLatLng, 8, { animate: true });
        setIsMyLocation(false);
      });
    }
  };

  // 지도 초기화
  useEffect(() => {
    onMapInit();
  }, [mapResetCount]); // 부모의 onAppInit이 실행되면 mapResetCount 값이 변경되고, 그것을 감지하여 지도를 초기화 한다.

  // 마커가 선택될 때
  useEffect(() => {
    onMarkerSelected();
  }, [selectedRoad]); // 마커가 선택될 때마다 지도의 센터에 마커가 오도록 계산

  return (
    <div>
      <Map
        center={SEOUL_CENTER}
        isPanto={true}
        className="w-screen h-screen"
        level={9}
        ref={mapRef}
        zoomable={false}
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
