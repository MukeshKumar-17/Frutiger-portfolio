import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaVolumeUp } from 'react-icons/fa';
import './MusicPlayer.css';

const MusicPlayer = ({ onClose, title, icon, zIndex, onFocus, initialPosition }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(256); // Example duration in seconds
    const [volume, setVolume] = useState(70);

    // Song data
    const currentSong = {
        title: "Midnight City",
        artist: "M83",
        album: "Hurry Up, We're Dreaming"
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

    return (
        <motion.div
            className="music-player-window"
            initial={{
                x: initialPosition?.x || 100,
                y: initialPosition?.y || 100,
                opacity: 0,
                scale: 0.9
            }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            drag
            dragMomentum={false}
            onDragStart={onFocus}
            onClick={onFocus}
            style={{
                position: 'fixed',
                zIndex: zIndex,
                width: 320,
                height: 140
            }}
        >
            <div className="music-player-title-bar">
                <div className="window-controls-mini">
                    <div className="control-dot red" onClick={(e) => { e.stopPropagation(); onClose(); }}></div>
                    <div className="control-dot yellow"></div>
                    <div className="control-dot green"></div>
                </div>
                <div className="music-player-title">iTunes</div>
            </div>

            <div className="music-player-body">
                {/* LCD Display */}
                <div className="lcd-display">
                    <div className="lcd-top-row">
                        <span>{formatTime(currentTime)}</span>
                        <span>{isPlaying ? 'Now Playing' : 'Paused'}</span>
                        <span>-{formatTime(duration - currentTime)}</span>
                    </div>
                    <div className="lcd-song-title">{currentSong.title}</div>
                    <div className="lcd-artist">{currentSong.artist}</div>

                    <div className="lcd-progress-container">
                        <div
                            className="lcd-progress-bar"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                        <div
                            className="lcd-progress-thumb"
                            style={{ left: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {/* Controls */}
                <div className="controls-row">
                    <div className="volume-control">
                        <FaVolumeUp className="volume-icon" />
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={volume}
                            onChange={(e) => setVolume(e.target.value)}
                            className="retro-slider"
                        />
                    </div>

                    <div className="playback-controls">
                        <button className="metal-btn btn-small">
                            <FaStepBackward size={10} />
                        </button>
                        <button
                            className={`metal-btn btn-large ${isPlaying ? 'playing' : ''}`}
                            onClick={togglePlay}
                        >
                            {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} style={{ marginLeft: 2 }} />}
                        </button>
                        <button className="metal-btn btn-small">
                            <FaStepForward size={10} />
                        </button>
                    </div>

                    <div className="shuffle-loop-controls" style={{ width: 60, display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                        {/* Placeholders for Shuffle/Loop if needed, or just visual balance */}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default MusicPlayer;
