import type { MergedItem } from "../type/geoTypes";

export type TrailState = {
  infos: MergedItem[];
  selectedRoad: number | null;
  isSideBarOpen: boolean;
  selectedLevel: string;
  mapResetCount: number;
};

export const initialTrailState = {
  infos: [],
  selectedRoad: null,
  isSideBarOpen: false,
  selectedLevel: "",
  mapResetCount: 0,
};

type TrailAction =
  | { type: "SET_INFOS"; payload: MergedItem[] }
  | { type: "SELECT_ROAD"; payload: number }
  | { type: "CLOSE_SIDEBAR" }
  | { type: "AFTER_SIDEBAR_CLOSED" }
  | { type: "APP_INIT" }
  | { type: "SET_LEVEL"; payload: string };

export function trailReducer(
  state: TrailState,
  action: TrailAction,
): TrailState {
  switch (action.type) {
    case "SET_INFOS":
      return { ...state, infos: action.payload };
    case "SELECT_ROAD":
      return { ...state, selectedRoad: action.payload, isSideBarOpen: true };
    case "CLOSE_SIDEBAR":
      return { ...state, isSideBarOpen: false };
    case "AFTER_SIDEBAR_CLOSED":
      if (!state.isSideBarOpen) return { ...state, selectedRoad: null };
      return state;
    case "APP_INIT":
      return {
        ...state,
        isSideBarOpen: false,
        selectedLevel: "",
        mapResetCount: state.mapResetCount + 1,
      };
    case "SET_LEVEL":
      return { ...state, selectedLevel: action.payload };
    default:
      return state;
  }
}
