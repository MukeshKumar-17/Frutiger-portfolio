import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp, FaMusic } from 'react-icons/fa';
import './AeroWindow.css';
import './MusicPlayer.css';

const MusicPlayer = ({ onClose, title, icon, zIndex = 100, onFocus, initialPosition = { x: 150, y: 150 }, triggerClose }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(256); // Example duration in seconds
    const [volume, setVolume] = useState(70);

    // Window state
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const windowRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    // Song data
    const currentSong = {
        title: "Midnight City",
        artist: "M83",
        album: "Hurry Up, We're Dreaming"
    };

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

    // Simulate playback
    useEffect(() => {
        let interval;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= duration) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, duration]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const progressPercentage = (currentTime / duration) * 100;

    // Dragging Logic
    const handleMouseDown = (e) => {
        if (e.target.closest('.window-control-btn') ||
            e.target.closest('button') ||
            e.target.closest('input')) return;

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
                            <div className="album-art-placeholder">
                                <FaMusic size={24} color="#88aacc" />
                            </div>
                            <div className="track-details">
                                <div className="track-title">{currentSong.title}</div>
                                <div className="track-artist">{currentSong.artist}</div>
                                <div className="track-album">{currentSong.album}</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="player-progress-section">
                            <div className="time-display left">{formatTime(currentTime)}</div>
                            <div className="progress-track">
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
                                <button className="control-btn prev-btn">
                                    <FaStepBackward size={12} />
                                </button>
                                <button className={`control-btn play-btn ${isPlaying ? 'active' : ''}`} onClick={togglePlay}>
                                    {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} style={{ marginLeft: 2 }} />}
                                </button>
                                <button className="control-btn next-btn">
                                    <FaStepForward size={12} />
                                </button>
                            </div>

                            <div className="volume-slider-container">
                                <FaVolumeUp size={12} color="#666" />
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={volume}
                                    onChange={(e) => setVolume(e.target.value)}
                                    className="aero-slider"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
