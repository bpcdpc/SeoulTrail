type HeaderProps = {
  onInit: () => void;
};

export default function Header({ onInit }: HeaderProps) {
  return (
    <header className="absolute top-3 left-3 z-1000">
      <h1 className="text-lg font-extrabold cursor-pointer" onClick={onInit}>
        SEOUL TRAIL
      </h1>
    </header>
  );
}
