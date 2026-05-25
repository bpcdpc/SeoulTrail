import { COURSE_LEVELS } from "../data/mapConstants";

type FilterButtonsProps = {
  onLevelChange: (levelName: string) => void;
};

export default function FilterButtons({ onLevelChange }: FilterButtonsProps) {
  return (
    <div className="absolute z-20 bottom-48 right-4 flex flex-col gap-1">
      <button
        className={`flex h-6 w-10 text-xs items-center justify-center rounded-sm text-white shadow-md font-semibold transition-all bg-blue-400`}
        onClick={() => {
          onLevelChange("");
        }}
      >
        전체
      </button>
      {COURSE_LEVELS.map((level) => (
        <button
          key={level.key}
          className={`flex h-6 w-10 text-xs items-center justify-center rounded-sm text-white shadow-md font-semibold transition-all ${level.className}`}
          onClick={() => {
            onLevelChange(level.key);
          }}
        >
          {level.key}
        </button>
      ))}
    </div>
  );
}
