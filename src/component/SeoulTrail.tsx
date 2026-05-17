import { useState, useEffect } from "react";
import type { MergedItem } from "../type/geoTypes";
import { fetchMergedItems } from "../util/fetchGeoData";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import MainMap from "./MainMap";
import { ENV } from "../config/env";
import SideBar from "./SideBar";
import Footer from "./Footer";
import Header from "./Header";
import StatusScreen from "./StatusScreen";
import RefreshButton from "./RefreshButton";
import Spinner from "./Spinner";

export default function SeoulTrail() {
  // 데이터를 담을 states
  const [infos, setInfos] = useState<MergedItem[]>([]);

  // 렌더링을 조건을 위한 states
  const [fetching, setFetching] = useState<boolean>(true);
  const [fetched, setFetched] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);

  // 카카오 지도 로딩 hook
  const [isMapLoading, mapLoadingError] = useKakaoLoader({
    appkey: ENV.MAP_KEY,
    libraries: ["services"],
  });

  // 선택된 둘레길을 위한 state
  const [selectedRoad, setSelectedRoad] = useState<number | null>(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState<boolean>(false);

  // 지도에서 특정 둘레길 마커를 선택할 때
  const onRoadSelect = (targetRoadNumber: number) => {
    setSelectedRoad(targetRoadNumber);
    setIsSideBarOpen(true);
  };

  // 선택된 마커의 둘레길 번호에 해당하는 객체를 지정
  const selectedItem: MergedItem = infos.filter(
    (item) => item.ROAD_NO === selectedRoad,
  )[0];

  // 사이드바가 닫힐 때
  const onSideBarClose = () => {
    setIsSideBarOpen(false);
  };

  // 사이드바가 닫힌 후에
  const afterSideBarClosed = () => {
    if (!isSideBarOpen) {
      setSelectedRoad(null);
    }
  };

  // 앱을 초기화
  const onAppInit = () => {
    setSelectedRoad(null);
    setIsSideBarOpen(false);
  };

  // 데이터 가져오기
  useEffect(() => {
    if (isMapLoading || mapLoadingError) return; // 지도가 로드되기 전에 데이터 가져오는 것을 방지

    const loadInitialData = async () => {
      try {
        const infoResults = await fetchMergedItems();
        setInfos(infoResults);
        setFetched(true); // 데이터가 성공적으로 가져와짐
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false); // 성공 실패에 관계없이 데이터 가져오는 과정이 끝났음
      }
    };
    loadInitialData();
  }, [isMapLoading, mapLoadingError]); // 지도 로딩 여부를 의존성 주입

  //  지도 로딩중
  if (isMapLoading)
    return (
      <StatusScreen message={"Map loading..."}>
        <Spinner />
      </StatusScreen>
    );

  // 지도 로딩 실패
  if (mapLoadingError)
    return (
      <StatusScreen message={"지도 로드에 실패했습니다. 다시 시도해 주세요."}>
        <RefreshButton />
      </StatusScreen>
    );

  // 데이터 로딩중
  if (fetching)
    return (
      <StatusScreen message={"Data loading..."}>
        <Spinner />
      </StatusScreen>
    );

  // 데이터 로딩 실패
  if (!fetched)
    return (
      <StatusScreen
        message={"데이터를 가져오는데 실패했습니다. 다시 시도해 주세요."}
      >
        <RefreshButton />
      </StatusScreen>
    );

  // 데이터 로딩 성공
  if (fetched && !showMap)
    return (
      <StatusScreen backgroundColor={"bg-blue-500"}>
        <button
          className="px-4 py-2 text-blue-600 bg-white rounded-md text-xl font-extrabold transition-all ease-in-out hover:scale-103"
          onClick={() => {
            setShowMap(true);
          }}
        >
          SOUEL TRAIL
        </button>
      </StatusScreen>
    );

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <Header onInit={onAppInit} />
      <SideBar
        item={selectedItem}
        isSideBarOpen={isSideBarOpen}
        onSideBarClose={onSideBarClose}
        afterSideBarClosed={afterSideBarClosed}
      />
      <MainMap
        infos={infos}
        selectedRoad={selectedRoad || null}
        onRoadSelect={onRoadSelect}
      />
      <Footer />
    </div>
  );
}
