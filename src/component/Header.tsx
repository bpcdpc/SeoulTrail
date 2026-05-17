import { useContext } from "react";
import { TrailDispatchContext } from "../context/TrailDispatchContext";

export default function Header() {
  const { onAppInit } = useContext(TrailDispatchContext);
  return (
    <header className="absolute top-3 left-3 z-100 overflow-hidden">
      <h1
        className="text-lg font-extrabold cursor-pointer text-nowrap"
        onClick={onAppInit}
      >
        SEOUL TRAIL
      </h1>
    </header>
  );
}
