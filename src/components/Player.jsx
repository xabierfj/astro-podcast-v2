import { h } from 'preact';
import { useState, useEffect, useRef, useCallback } from 'preact/hooks';

// Helper function to format time (e.g., 01:05)
function formatTime(timeInSeconds) {
  if (isNaN(timeInSeconds) || timeInSeconds === Infinity) return '00:00';
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}


export default function Player() {
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [volume, setVolume] = useState(1); // Volume 0 to 1
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false); // To prevent time updates while dragging seek bar

  const audioRef = useRef(null);
  const progressBarRef = useRef(null); // Ref for the seek bar

  const podcastMainImage = '/logo.webp'; // Fallback podcast image from your podcast-info.ts

  // Effect to handle 'playEpisode' events from other components
  useEffect(() => {
    const handlePlayEpisode = (event) => {
      if (event.detail && event.detail.enclosure && event.detail.enclosure.url) {
        setCurrentEpisode(event.detail);
        setIsPlaying(true);
        setIsPlayerVisible(true);
        setCurrentTime(0); // Reset time for new episode
        if (audioRef.current) { // If audio element exists, reset its time too
            audioRef.current.currentTime = 0;
        }
      } else {
        console.warn("Player received episode without valid audio URL:", event.detail);
      }
    };
    window.addEventListener('playEpisode', handlePlayEpisode);
    return () => window.removeEventListener('playEpisode', handlePlayEpisode);
  }, []);

  // Effect to manage audio source and play/pause state
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentEpisode?.enclosure?.url) {
      if (audio.src !== currentEpisode.enclosure.url) { // Only change src if it's a new episode
        audio.src = currentEpisode.enclosure.url;
      }
      if (isPlaying) {
        audio.play().catch(e => console.error("Error playing audio:", e));
      } else {
        audio.pause();
      }
    } else if (audio) {
      audio.pause();
    }
  }, [currentEpisode, isPlaying]);

  // Effect for volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Audio event listeners setup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => {
      if (!isSeeking) { // Only update if not currently dragging the seek bar
        setCurrentTime(audio.currentTime);
      }
    };
    const handleEnded = () => {
      setIsPlaying(false);
      // Optional: play next episode if playlist functionality exists
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [isSeeking]); // Re-attach if isSeeking changes, though typically not needed for these listeners

  const togglePlay = () => {
    if (currentEpisode) {
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleSeek = (e) => {
    if (audioRef.current && currentEpisode) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime); // Immediately update UI
    }
  };
  
  const startSeek = () => setIsSeeking(true);
  const endSeek = () => setIsSeeking(false);


  if (!isPlayerVisible || !currentEpisode) {
    return null; // Or a very minimal placeholder
  }

  const episodeImage = currentEpisode.image || podcastMainImage;

  return (
    <div class="w-full h-full max-w-4xl mx-auto p-2 md:p-3 flex items-center gap-3 md:gap-4 text-white">
      {/* Episode Art */}
      <div class="flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded overflow-hidden shadow-lg">
        <img 
          src={episodeImage} 
          alt={currentEpisode.title || "Episode Art"} 
          class="w-full h-full object-cover" 
          onError={(e) => e.target.src = podcastMainImage} // Fallback if episode image fails
        />
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        class="flex-shrink-0 p-2 bg-theme-red hover:bg-theme-red-dark text-white rounded-full focus:outline-none focus:ring-2 focus:ring-theme-red-light transition-colors"
      >
        {isPlaying ? 
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1zm6 0a1 1 0 00-1 1v2a1 1 0 102 0V9a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
          : 
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
        }
      </button>

      {/* Main Controls Area (Title, Seek Bar, Time) */}
      <div class="flex-grow flex flex-col justify-center overflow-hidden gap-1 md:gap-1.5">
        <p class="text-xs md:text-sm font-semibold text-theme-brown truncate" title={currentEpisode.title}>
          {currentEpisode.title}
        </p>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400 dark:text-gray-300 w-9 text-center">{formatTime(currentTime)}</span>
          <input
            type="range"
            ref={progressBarRef}
            min="0"
            max={duration || 0}
            value={currentTime}
            onMouseDown={startSeek} // When user clicks down
            onTouchStart={startSeek} // For touch devices
            onInput={handleSeek} // As user drags
            onMouseUp={endSeek} // When user releases click
            onTouchEnd={endSeek} // For touch devices
            aria-label="Seek progress"
            class="w-full h-1.5 md:h-2 bg-gray-500/50 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-theme-red dark:accent-theme-red-light focus:outline-none focus:ring-1 focus:ring-theme-red"
            // Style the thumb using ::-webkit-slider-thumb and ::-moz-range-thumb in global CSS if needed for more customization
          />
          <span class="text-xs text-gray-400 dark:text-gray-300 w-9 text-center">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div class="flex-shrink-0 flex items-center gap-1 md:gap-2 ml-2 md:ml-4">
        {volume > 0.5 && <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clip-rule="evenodd" /></svg>}
        {volume <= 0.5 && volume > 0 && <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0A2.99 2.99 0 0114 10a2.99 2.99 0 01-.293 1.293 1 1 0 01-1.414-1.414A.99 .99 0 0012 10a.99 .99 0 00-.293-.707 1 1 0 010-1.414z" clip-rule="evenodd" /></svg>}
        {volume === 0 && <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 md:h-5 md:w-5 text-gray-300" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 3.636a1 1 0 011.414 0L10 7.172l3.536-3.536a1 1 0 111.414 1.414L11.414 8.586l3.536 3.535a1 1 0 11-1.414 1.415L10 10.001l-3.536 3.535a1 1 0 01-1.414-1.415L8.586 8.586 5.05 5.05a1 1 0 010-1.414zM9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clip-rule="evenodd" /></svg>}
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onInput={handleVolumeChange}
          aria-label="Volume control"
          class="w-16 md:w-20 h-1.5 md:h-2 bg-gray-500/50 dark:bg-gray-700 rounded-full appearance-none cursor-pointer accent-theme-red dark:accent-theme-red-light focus:outline-none focus:ring-1 focus:ring-theme-red"
        />
      </div>
      
      <audio ref={audioRef} preload="metadata" class="hidden" />
    </div>
  );
}