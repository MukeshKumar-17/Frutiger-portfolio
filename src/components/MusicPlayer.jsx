import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FaPlay, FaPause, FaStepBackward, FaStepForward } from 'react-icons/fa';
import { Volume2, VolumeX, Music as FaMusic } from 'lucide-react';
import './AeroWindow.css';
import './MusicPlayer.css';

const songs = [
    { file: 'aquatic_ambiance.mp3', title: 'AeroMusic 01' },
    { file: 'around_the_world.mp3', title: 'AeroMusic 02' },
    { file: 'axel_f.mp3', title: 'AeroMusic 03' },
    { file: 'frutiger_aero (1).mp3', title: 'AeroMusic 04' },
    { file: 'frutiger_aero.mp3', title: 'AeroMusic 05' },
    { file: 'frutiger_aero_parte1.mp3', title: 'AeroMusic 06' },
    { file: 'frutiger_tone.mp3', title: 'AeroMusic 07' },
    { file: 'golden_brown.mp3', title: 'AeroMusic 08' },
    { file: 'idila_piano.mp3', title: 'AeroMusic 09' },
    { file: 'love_on_top.mp3', title: 'AeroMusic 10' },
    { file: 'my_heaven.mp3', title: 'AeroMusic 11' },
];

const MusicPlayer = ({ onClose, title, icon, zIndex = 100, onFocus, initialPosition = { x: 150, y: 150 }, triggerClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(100);
    const [isMuted, setIsMuted] = useState(false);

    const audioRef = useRef(new Audio(`/Ringtones/${songs[0].file}`));

    // Window state
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const windowRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    // GSAP entrance animation
    useEffect(() => {
        const windowEl = windowRef.current;
        if (!windowEl) return;

        gsap.set(windowEl, {
            opacity: 0,
            scale: 0.92,
            y: 25,
            transformOrigin: 'center center',
            force3D: true,
        });

        gsap.to(windowEl, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.25,
            ease: 'power1.out',
            force3D: true,
        });
    }, []);

    // Initialize Audio
    useEffect(() => {
        const audio = audioRef.current;
        audio.volume = volume / 100;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleEnded = () => handleNext(); // Auto play next

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.pause(); // Cleanup pause
        };
    }, []);

    // Handle song change
    useEffect(() => {
        const audio = audioRef.current;
        const wasPlaying = isPlaying;

        audio.src = `/Ringtones/${songs[currentSongIndex].file}`;
        audio.load();

        if (wasPlaying) {
            audio.play().catch(e => console.error("Playback failed:", e));
        }
    }, [currentSongIndex]);

    // Handle Volume Change
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : (volume / 100);
        }
    }, [volume, isMuted]);

    const toggleMute = () => setIsMuted(!isMuted);

    // Play/Pause toggle
    const togglePlay = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.error("Playback failed:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        setCurrentSongIndex((prev) => (prev + 1) % songs.length);
        setIsPlaying(true); // Force play on manual change
    };

    const handlePrev = () => {
        setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
        setIsPlaying(true);
    };

    const handleSeek = (e) => {
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const width = rect.width;
        const seekTime = (offsetX / width) * duration;

        if (isFinite(seekTime)) {
            audioRef.current.currentTime = seekTime;
            setCurrentTime(seekTime);
        }
    };

    // Handle external close trigger
    useEffect(() => {
        if (triggerClose && !isClosing) {
            handleClose();
        }
    }, [triggerClose]);

    // Handle close with animation
    const handleClose = () => {
        const windowEl = windowRef.current;
        if (!windowEl || isClosing) return;

        setIsClosing(true);
        // Pause audio on close
        audioRef.current.pause();

        gsap.to(windowEl, {
            opacity: 0,
            scale: 0.95,
            y: 15,
            duration: 0.18,
            ease: 'power1.in',
            force3D: true,
            onComplete: () => {
                onClose();
            }
        });
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

    // Dragging Logic
    const handleMouseDown = (e) => {
        if (e.target.closest('.window-control-btn') ||
            e.target.closest('button') ||
            e.target.closest('input') ||
            e.target.closest('.progress-track')) return; // Allow seeking without dragging window

        e.stopPropagation();
        if (onFocus) onFocus();

        setIsDragging(true);
        const rect = windowRef.current.getBoundingClientRect();
        offsetRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - offsetRef.current.x,
            y: e.clientY - offsetRef.current.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleWindowClick = (e) => {
        e.stopPropagation();
        if (onFocus) onFocus();
    };

    return (
        <div
            ref={windowRef}
            className="aero-window music-player-window"
            style={{
                left: position.x,
                top: position.y,
                cursor: isDragging ? 'grabbing' : 'grab',
                width: '400px',
                height: 'auto',
                zIndex: zIndex
            }}
            onMouseDown={handleMouseDown}
            onClick={handleWindowClick}
        >
            {/* Glass Frame */}
            <div className="aero-frame">
                {/* Title Bar */}
                <div className="aero-titlebar">
                    <div className="aero-window-controls">
                        <button className="window-control-btn minimize-btn" onClick={handleClose}>
                            <span className="control-icon">─</span>
                        </button>
                        <button className="window-control-btn maximize-btn" onClick={handleClose}>
                            <span className="control-icon">□</span>
                        </button>
                        <button className="window-control-btn close-btn" onClick={handleClose}>
                            <span className="control-icon">✕</span>
                        </button>
                    </div>
                    <span className="aero-title">iTunes</span>
                </div>

                {/* Content Area */}
                <div className="aero-content" style={{ flexDirection: 'column', background: '#f0f3f6' }}>
                    <div className="music-player-aero-body">

                        {/* Song Info Area */}
                        <div className="song-info-display">
                            <div className="album-art-placeholder" style={{ overflow: 'hidden', border: '1px solid #aab' }}>
                                <img
                                    src="/coverimg.jpg"
                                    alt="Album Art"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                            <div className="track-details">
                                <div className="track-title">{songs[currentSongIndex].title}</div>
                                <div className="track-artist">Frutiger Artist</div>
                                <div className="track-album">Aero Collection</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="player-progress-section">
                            <div className="time-display left">{formatTime(currentTime)}</div>
                            <div className="progress-track" onClick={handleSeek} style={{ cursor: 'pointer' }}>
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                            <div className="time-display right">-{formatTime(duration - currentTime)}</div>
                        </div>

                        {/* Controls Section */}
                        <div className="player-controls-section">
                            <div className="main-controls">
                                <button className="control-btn prev-btn" onClick={handlePrev}>
                                    <FaStepBackward size={12} />
                                </button>
                                <button className={`control-btn play-btn ${isPlaying ? 'active' : ''}`} onClick={togglePlay}>
                                    {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} style={{ marginLeft: 2 }} />}
                                </button>
                                <button className="control-btn next-btn" onClick={handleNext}>
                                    <FaStepForward size={12} />
                                </button>
                            </div>

                            <div className="volume-slider-container">
                                <button
                                    className="volume-btn"
                                    onClick={toggleMute}
                                    aria-label={isMuted ? "Unmute" : "Mute"}
                                >
                                    {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => {
                                        setVolume(e.target.value);
                                        if (e.target.value > 0 && isMuted) setIsMuted(false);
                                    }}
                                    className="aero-slider"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="music-player-statusbar">
                    <span>{songs[currentSongIndex].title}</span>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
