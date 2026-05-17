// import pathData "./data/path_simple_0.005.geojson"

import PathData from "../data/path_simple_0.0001.json";
import type { Position } from "../type/geoTypes";

export function parseGeoJson() {
  const rawData = PathData.features;
  if (!rawData || rawData.length === 0) {
    throw new Error("Parsing Error: GeoJSON 파일을 파싱할 수 없습니다.");
  }
  // 3차원 배열. QGIS 에서 생성하는 기본 좌표 포맷이다.
  const rawGeoCoords = rawData.map((feature) => feature.geometry.coordinates);

  // const GeoCoords2D = rawGeoCoords.map((coords) => coords[0]); // 2차원으로 만든다.

  // 카카오맵 Polyline 좌표 배열 형식으로 만든다.
  const Positions: Position[][][] = rawGeoCoords.map((coords) =>
    coords.map((coordsArr) => {
      return coordsArr.map((position) => ({
        lat: position[1],
        lng: position[0],
      }));
    }),
  );

  return Positions;
}
