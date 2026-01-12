import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import DomeGallery from './DomeGallery';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import './AeroWindow.css';
import './GalleryAudioPlayer.css';

export default function GalleryWindow({ title, icon, onClose, initialPosition = { x: 100, y: 100 }, zIndex = 100, onFocus, triggerClose }) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isGalleryReady, setIsGalleryReady] = useState(false);
    const windowRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    // GSAP entrance animation
    useEffect(() => {
        const window = windowRef.current;
        if (!window) return;

        // Set initial state - use minimal transforms for smooth animation
        gsap.set(window, {
            opacity: 0,
            scale: 0.92,
            y: 25,
            transformOrigin: 'center center',
            force3D: true,
            willChange: 'transform, opacity'
        });

        // Animate in with buttery smooth easing
        gsap.to(window, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.25,
            ease: 'power1.out',
            force3D: true,
            clearProps: 'willChange',
            onComplete: () => {
                // Delay rendering heavy DomeGallery until animation is done
                setTimeout(() => setIsGalleryReady(true), 100);
            }
        });
    }, []);

    // Handle external close trigger
    useEffect(() => {
        if (triggerClose && !isClosing) {
            handleClose();
        }
    }, [triggerClose]);

    // Handle close with pop-out animation
    const handleClose = () => {
        const window = windowRef.current;
        if (!window || isClosing) return;

        setIsClosing(true);

        gsap.to(window, {
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

    const handleMouseDown = (e) => {
        // Don't drag if clicking on buttons, inputs, or gallery content
        if (e.target.closest('.window-control-btn') ||
            e.target.closest('button') ||
            e.target.closest('input') ||
            e.target.closest('.sphere-root')) return;

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
        <div className="gallery-window-wrapper" style={{ position: 'absolute', left: position.x, top: position.y, zIndex: zIndex }}>
            <div
                ref={windowRef}
                className="aero-window"
                style={{
                    cursor: isDragging ? 'grabbing' : 'grab',
                    width: '850px',
                    height: '600px',
                    position: 'relative'
                }}
                onMouseDown={handleMouseDown}
                onClick={handleWindowClick}
            >
                {/* Glass Frame */}
                <div className="aero-frame" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                        <span className="aero-title">
                            {title || 'Art Gallery'}
                        </span>
                    </div>

                    {/* Content Area - Gallery */}
                    <div className="aero-content" style={{
                        padding: 0,
                        overflow: 'hidden',
                        position: 'relative',
                        flex: 1,
                        display: 'flex',
                        background: '#0a0a12'
                    }}>
                        {isGalleryReady ? (
                            <DomeGallery
                                grayscale={false}
                                overlayBlurColor="#0a0a12"
                                imageBorderRadius="16px"
                                openedImageBorderRadius="20px"
                                openedImageWidth="300px"
                                openedImageHeight="400px"
                                fit={0.6}
                                minRadius={400}
                                segments={25}
                            />
                        ) : (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '100%',
                                height: '100%',
                                color: '#888',
                                fontSize: '16px',
                                background: '#0a0a12'
                            }}>
                                Loading Gallery...
                            </div>
                        )}
                    </div>

                    {/* Audio Player - Inside frame for proper border-radius clipping */}
                    {isGalleryReady && <AudioPlayer />}
                </div>
            </div>
        </div>
    );
}

function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        audioRef.current = new Audio('/Music/Neverending_night.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = volume;

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(error => {
                console.log("Auto-play prevented:", error);
                setIsPlaying(false);
            });
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
            setIsMuted(false);
        }
    };

    return (
        <div className="gallery-audio-player">
            <div className="glass-panel">
                <div className="player-controls">
                    <button
                        className="player-btn play-btn"
                        onClick={togglePlay}
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause size={20} /> : <Play size={20} fill="currentColor" />}
                    </button>

                    <div className="volume-control">
                        <button
                            className="player-btn volume-btn"
                            onClick={toggleMute}
                            aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="volume-slider"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
