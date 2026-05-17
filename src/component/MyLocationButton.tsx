import { LocateFixed } from "lucide-react";

type MyLocationButtonProps = {
  onMyLocation: () => void;
};
export default function MyLocationButton({
  onMyLocation,
}: MyLocationButtonProps) {
  return (
    <div className="absolute z-20 bottom-14 right-4">
      <button
        onClick={onMyLocation}
        className="flex h-10 w-10 items-center justify-center bg-white rounded-sm shadow-md transition-all hover:bg-gray-50"
      >
        <LocateFixed size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}
