import { useState, useEffect } from "react";
import type { PathItem, InfoItem, PointItem, MergedItem } from "../type/types";
import {
  fetchPathItems,
  fetchInfoItems,
  fetchPointItems,
  fetchMergedItems,
} from "../util/fetchData";
import { useKakaoLoader } from "react-kakao-maps-sdk";
import MainMap from "./MainMap";
import { ENV } from "../config/env";

export default function SeoulTrail() {
  const [points, setPoints] = useState<PointItem[]>([]);
  const [paths, setPaths] = useState<PathItem[]>([]);
  const [infos, setInfos] = useState<MergedItem[]>([]);

  const [loading, error] = useKakaoLoader({
    appkey: ENV.KAKAO_KEY,
    libraries: ["services", "clusterer", "drawing"],
  });

  const [fetching, setFetching] = useState<boolean>(true);
  const [fetched, setFetched] = useState<boolean>(false);

  useEffect(() => {
    if (loading) return;

    async function loadInitialData() {
      try {
        const [pointResults, pathResults, infoResults] = await Promise.all([
          fetchPointItems(),
          fetchPathItems(),
          //   fetchInfoItems(),
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
  }, [loading]);

  if (loading)
    return (
      <div className="flex flex-col gap-2 items-center justify-center w-screen h-screen bg-gray-100">
        <div className="text-4xl">Map Loading....</div>
      </div>
    );

  if (fetching) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center w-screen h-screen bg-gray-100">
        <div className="text-4xl">Data Fetching....</div>
      </div>
    );
  }

  if (!fetched) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center w-screen h-screen bg-gray-100">
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
  }

  if (error)
    return (
      <div className="flex flex-col gap-2 items-center justify-center w-screen h-screen bg-gray-100">
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

  return <MainMap points={points} paths={paths} infos={infos} />;
}
