import { useState, useEffect } from "react";
import type { PathItem, PointItem, MergedItem } from "../type/types";
import {
  fetchPathItems,
  fetchPointItems,
  fetchMergedItems,
} from "../util/fetchData";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import MainMap from "./MainMap";
import { ENV } from "../config/env";
import SideBar from "./SideBar";

export default function SeoulTrail() {
  // 데이터를 담을 states
  const [points, setPoints] = useState<PointItem[]>([]);
  const [paths, setPaths] = useState<PathItem[]>([]);
  const [infos, setInfos] = useState<MergedItem[]>([]);

  // 렌더링을 조건을 위한 states
  const [fetching, setFetching] = useState<boolean>(true);
  const [fetched, setFetched] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);

  // 선택된 아이템을 위한 state
  const [selectedRoad, setSelectedRoad] = useState<number | null>(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);

  const onRoadSelect = (targetRoadNumber: number) => {
    setSelectedRoad(targetRoadNumber);
    setIsSideBarOpen(true);
  };

  const onSideBarClose = () => {
    setIsSideBarOpen(false);
    setSelectedRoad(null);
  };

  const onSideBarOpen = () => {
    setIsSideBarOpen(true);
  };

  // 카카오 지도 로딩 hook
  const [mapLoaded, mapLoadingError] = useKakaoLoader({
    appkey: ENV.KAKAO_KEY,
    libraries: ["services", "drawing"],
  });

  // 데이터 가져오기
  useEffect(() => {
    if (mapLoaded) return; // 지도가 로드되기 전에 데이터 가져오는 것을 방지

    async function loadInitialData() {
      try {
        const [pointResults, pathResults, infoResults] = await Promise.all([
          fetchPointItems(),
          fetchPathItems(),
          fetchMergedItems(),
        ]);
        setPoints(pointResults);
        setPaths(pathResults);
        setInfos(infoResults);
        setFetched(true);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    }
    loadInitialData();
  }, [mapLoaded]); // 지도 로딩 여부를 의존성으로 주입

  //  지도 로딩중
  if (mapLoaded)
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-screen h-screen bg-gray-100">
        <div className="text-2xl">Map Loading....</div>
      </div>
    );

  // 지도 로딩 실패
  if (mapLoadingError)
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-screen h-screen bg-gray-100">
        <div>지도 로드에 실패했습니다. 다시 시도해 주세요.</div>
        <button
          className="px-2 py-1 text-white bg-gray-500 rounded-lg text-sm"
          onClick={() => {
            window.location.reload();
          }}
        >
          새로고침
        </button>
      </div>
    );

  // 데이터 로딩
  if (fetching)
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-screen h-screen bg-gray-100">
        <div className="text-2xl">Data Fetching....</div>
      </div>
    );

  // 데이터 로딩 실패
  if (!fetched)
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-screen h-screen bg-gray-100">
        <div>데이터를 가져오는데 실패했습니다. 다시 시도해 주세요.</div>
        <button
          className="px-2 py-1 text-white bg-gray-500 rounded-lg text-sm"
          onClick={() => {
            window.location.reload();
          }}
        >
          새로고침
        </button>
      </div>
    );

  // 데이터 로딩 성공
  if (fetched && !showMap)
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-screen h-screen bg-gray-100">
        <div className="text-2xl">데이터가 준비되었습니다.</div>
        <button
          className="px-4 py-2 text-white bg-blue-500 rounded-lg"
          onClick={() => {
            setShowMap(true);
          }}
        >
          시작
        </button>
      </div>
    );

  const selectedItem: MergedItem = infos.filter(
    (item) => item.ROAD_NO === selectedRoad,
  )[0];

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <SideBar
        item={selectedItem}
        isSideBarOpen={isSideBarOpen}
        onSideBarClose={onSideBarClose}
      />
      {/* <OpenButton onSideBarOpen={onSideBarOpen} /> */}
      <MainMap
        points={points}
        paths={paths}
        infos={infos}
        selectedRoad={selectedRoad || null}
        onRoadSelect={onRoadSelect}
      />
    </div>
  );
}
