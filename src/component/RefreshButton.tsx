export default function RefreshButton() {
  return (
    <button
      className="px-2 py-1 text-white bg-gray-500 rounded-md text-sm"
      onClick={() => {
        window.location.reload();
      }}
    >
      새로고침
    </button>
  );
}
