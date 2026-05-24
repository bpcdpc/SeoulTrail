import { Plus, Minus } from "lucide-react";
type ZoomButtonsProps = {
  zoomIn: () => void;
  zoomOut: () => void;
};

export default function ZoomButtons({ zoomIn, zoomOut }: ZoomButtonsProps) {
  return (
    <div className="absolute z-20 bottom-26 right-4 flex flex-col bg-white rounded-sm shadow-md overflow-hidden">
      <button
        className="flex h-10 w-10 items-center justify-center border-b border-b-gray-200 transition-all hover:bg-gray-50"
        onClick={zoomIn}
      >
        <Plus size={20} strokeWidth={2.5} />
      </button>
      <button
        className="flex h-10 w-10 items-center justify-center transition-all hover:bg-gray-50"
        onClick={zoomOut}
      >
        <Minus size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}
