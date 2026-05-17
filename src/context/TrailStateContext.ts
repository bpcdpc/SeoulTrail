import { createContext } from "react";
import type { MergedItem } from "../type/geoTypes";

type TrailStateContextType = {
  infos: MergedItem[];
  selectedRoad: number | null;
  isSideBarOpen: boolean;
  selectedLevel: string;
};

export const TrailStateContext = createContext<TrailStateContextType>({
  infos: [],
  selectedRoad: null,
  isSideBarOpen: false,
  selectedLevel: "",
});
