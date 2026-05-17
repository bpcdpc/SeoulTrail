export interface PointItem {
  SN: string;
  NM: string;
  LAT: string;
  LOT: string;
}

export interface PointResponse {
  SdeDoDreamWay01PW: {
    list_total_count: number;
    RESULT: {
      CODE: string;
      MESSAGE: string;
    };
    row: PointItem[];
  };
}

export interface PathItem {
  SN: string;
  NM: string;
  SHP: string;
  LAT: string;
  LOT: string;
}

export interface PathResponse {
  SdeDoDreamWay01LW: {
    list_total_count: number;
    RESULT: {
      CODE: string;
      MESSAGE: string;
    };
    row: PathItem[];
  };
}

export interface InfoItem {
  MENU_SN: string;
  ROAD_NO: number;
  ROAD_NM: string;
  ROAD_SUB_TTL: string;
  LV_KORN: string;
  ROAD_EXPLN: string;
  ROAD_DTL_NM: string;
  BGNG_PSTN: string;
  END_PSTN: string;
  STMP_PSTN_1: string;
  ROAD_LEN: number;
  REQ_HR: string;
  STMP_PSTN_2: string;
  STMP_PSTN_3: string;
  SEOUL_MAP_URL: string;
  FILE_DWNLD_LNKG: string;
}

export interface InfoResponse {
  viewGil: {
    list_total_count: number;
    RESULT: {
      CODE: string;
      MESSAGE: string;
    };
    row: InfoItem[];
  };
}

export interface Position {
  lat: number;
  lng: number;
}

export interface MergedItem extends InfoItem {
  position: Position;
}
