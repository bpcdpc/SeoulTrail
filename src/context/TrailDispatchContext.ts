import { createContext } from "react";

type TrailDispatchContextType = {
  onRoadSelect: (targetRoadNumber: number) => void;
  onSideBarClose: () => void;
  afterSideBarClosed: () => void;
  onAppInit: () => void;
  onLevelChange: (levelName: string) => void;
};

export const TrailDispatchContext = createContext<TrailDispatchContextType>({
  onRoadSelect: () => {},
  onSideBarClose: () => {},
  afterSideBarClosed: () => {},
  onAppInit: () => {},
  onLevelChange: () => {},
});
