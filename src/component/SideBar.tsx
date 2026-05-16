import type { MergedItem } from "../type/types";
import { X } from "lucide-react";

type SideBarProps = {
  item: MergedItem;
  isSideBarOpen: boolean;
  onSideBarClose: () => void;
};

export default function SideBar({
  item,
  isSideBarOpen,
  onSideBarClose,
}: SideBarProps) {
  console.log(item);
  return (
    <aside
      className={`transition-all duration-300 absolute z-1000 bg-white overflow-hidden h-full ${
        isSideBarOpen ? "w-full sm:w-80 xl:w-100" : "w-0"
      }`}
    >
      <button onClick={onSideBarClose} className="absolute right-2 top-3 z-100">
        <X size={30} strokeWidth={2.5} />
      </button>
      <div className="w-screen sm:w-80 xl:w-100 pt-14 px-2 pb-6 h-full overflow-x-hidden overflow-y-scroll">
        {isSideBarOpen && <h3>{item.ROAD_NM}</h3>}
      </div>
    </aside>
  );
}
