import { useState } from "react";

const Play = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="#000000">
    <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
  </svg>
);

const Pause = () => (
  <svg role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16" fill="#000000">
    <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
  </svg>
);

export function Player() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="flex flex-row justify-between w-full px-4 z-50">
      <div>Current Episode...</div>
      <div className="grid place-content-center gap-4 flex-1">
        <div className="flex justtify-center">
          <button className="bg-gray-200 hover:bg-gray-300 rounded-full p-2" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause /> : <Play />}
          </button>
        </div>
      </div>
      <div>Volume</div>
    </div>
  );
}
