import type { MergedItem } from "../type/types";
import { X } from "lucide-react";

type SideBarProps = {
  item: MergedItem;
  isSideBarOpen: boolean;
  onSideBarClose: () => void;
  afterSideBarClosed: () => void;
};

export default function SideBar({
  item,
  isSideBarOpen,
  onSideBarClose,
  afterSideBarClosed,
}: SideBarProps) {
  const {
    ROAD_NO = "",
    ROAD_NM = "",
    ROAD_SUB_TTL = "",
    LV_KORN = "",
    ROAD_LEN = 0,
    REQ_HR = "",
    ROAD_DTL_NM = "",
    STMP_PSTN_1 = "",
    STMP_PSTN_2 = "",
    STMP_PSTN_3 = "",
    ROAD_EXPLN = "",
  } = item || {};

  const LEVEL_MAP = [
    { key: "초급", className: "bg-green-600" },
    { key: "중급", className: "bg-orange-400" },
    { key: "상급", className: "bg-red-600" },
  ];

  const matched = LEVEL_MAP.find(({ key }) => LV_KORN.includes(key));
  const levelClassName = matched ? matched.className : "";

  const onTransitionEnd = (e: React.TransitionEvent<HTMLElement>) => {
    if (e.target === e.currentTarget && e.propertyName === "width") {
      afterSideBarClosed();
    }
  };

  return (
    <aside
      className={`transition-[width] duration-300 absolute z-500 bg-gray-50 overflow-hidden h-full shadow-2xl ${
        isSideBarOpen ? "w-full sm:w-100 xl:w-120" : "w-0"
      }`}
      onTransitionEnd={onTransitionEnd}
    >
      <button onClick={onSideBarClose} className="absolute right-3 top-3 z-100">
        <X size={30} strokeWidth={1.5} color="#333" />
      </button>
      <div className="w-screen sm:w-100 xl:w-120 pt-20 pl-3 pr-10 pb-6 h-full overflow-x-hidden overflow-y-scroll">
        {item && (
          <div className="text-gray-800 flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold flex gap-2 items-center">
                <span className="bg-blue-600 text-white flex items-center justify-center w-[46px] h-[45px] rounded-lg outline outline-2 outline-blue-50 -outline-offset-5">
                  {ROAD_NO}
                </span>
                <span>{ROAD_NM}길</span>
              </h3>
              <h4 className="text-slate-500">{ROAD_SUB_TTL}</h4>
              <div className="flex gap-2 items-center">
                <span
                  className={`bg-gray-400 text-white px-1.5 py-0.5 rounded-sm text-xs ${levelClassName}`}
                >
                  {LV_KORN} 코스
                </span>
                <span>
                  {ROAD_LEN}km, {REQ_HR}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <div className="text-slate-500">경유지점</div>
              <div>{ROAD_DTL_NM.replaceAll(",", " - ")}</div>
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <div className="text-slate-500">스탬프함 위치</div>
              <div className="flex flex-wrap gap-1">
                {[STMP_PSTN_1, STMP_PSTN_2, STMP_PSTN_3]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-slate-500  text-sm">둘레길 설명</div>
              <p>{ROAD_EXPLN}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
