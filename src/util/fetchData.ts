import { ENV } from "../config/env";
import type {
  InfoItem,
  InfoResponse,
  MergedItem,
  PathItem,
  PathResponse,
  PointItem,
  PointResponse,
  Position,
} from "../type/types";

// 데이터 페칭
async function fetchData<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = res.text();
      throw new Error(`HTTP Error : ${res.status} ${errorText}`);
    }
    const data: T = await res.json();
    return data;
  } catch (err) {
    if (err instanceof Error) console.log(err);
    return null;
  }
}

// 둘레길 상세 정보 아이템
export async function fetchInfoItems(): Promise<InfoItem[]> {
  const url = `${ENV.SODATA_URL}/${ENV.SODATA_KEY}/json/viewGil/1/100`;
  const infoRes: InfoResponse | null = await fetchData<InfoResponse>(url);
  if (!infoRes) throw new Error("둘레길 정보를 가져오지 못했습니다.");
  return infoRes.viewGil.row;
}

// 둘레길 선형 좌표
export async function fetchPathItems(): Promise<PathItem[]> {
  const url = `${ENV.SODATA_URL}/${ENV.SODATA_KEY}/json/SdeDoDreamWay01LW/1/100`;
  const pathRes: PathResponse | null = await fetchData<PathResponse>(url);
  if (!pathRes) throw new Error("둘레길 선형 좌표를 가져오지 못했습니다.");
  return pathRes.SdeDoDreamWay01LW.row;
}

// 둘레길 점형 좌표
export async function fetchPointItems(): Promise<PointItem[]> {
  const url = `${ENV.SODATA_URL}/${ENV.SODATA_KEY}/json/SdeDoDreamWay01PW/1/200`;
  const pointRes: PointResponse | null = await fetchData<PointResponse>(url);
  if (!pointRes) throw new Error("둘레길 점형 좌표를 가져오지 못했습니다.");
  return pointRes.SdeDoDreamWay01PW.row;
}

// 둘레길 이름으로 좌표 얻어오기
function getPositionByName(name: string): Promise<Position> {
  return new Promise((resolve, reject) => {
    const places = new kakao.maps.services.Places();

    places.keywordSearch(name, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        resolve({ LAT: result[0].y, LOT: result[0].x });
      } else {
        reject(new Error("좌표를 찾을 수 없습니다."));
      }
    });
  });
}

// 비동기 딜레이
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 둘레길 상세 정보에 위도, 경도 정보 병함
export async function fetchMergedItems(): Promise<MergedItem[]> {
  // const CACHE_KEY = "seoul_trail_merged_items";
  // const cachedData = localStorage.getItem(CACHE_KEY);

  // 캐시가 존재한다면 캐시 데이터를 반환
  // if (cachedData) {
  //   console.log("캐시 데이터가 존재하므로 캐시된 데이터를 불러옵니다.");
  //   return JSON.parse(cachedData) as MergedItem[];
  // }

  // 둘레길 상세 정보 fetch
  const infoItems: InfoItem[] = await fetchInfoItems();

  const mergedItems: MergedItem[] = [];

  // 둘레길 상세 정보에 순차적으로 위도 경도 주입
  for (const item of infoItems) {
    try {
      const cleanName = item.BGNG_PSTN.trim();
      const position = await getPositionByName(cleanName);
      mergedItems.push({ ...item, position });
      console.log(`${item.BGNG_PSTN} 좌표 검색 성공`);
      await delay(800);
    } catch (error) {
      console.error(`${item.BGNG_PSTN} 좌표 검색 실패:`, error);
    }
  }

  // 하나도 가져오지 못했을 경우
  if (mergedItems.length === 0)
    throw new Error("좌표를 하나도 가져오지 못했습니다.");

  // 로컬 스토리지에 저장하고 데이터 반환
  console.log(
    `좌표 검색이 끝났습니다. 전체 ${infoItems.length}개 중 ${mergedItems.length}개 성공`,
  );
  // localStorage.setItem(CACHE_KEY, JSON.stringify(mergedItems));
  return mergedItems;
}
