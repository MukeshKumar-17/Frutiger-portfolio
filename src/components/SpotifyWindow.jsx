import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './SpotifyWindow.css';

export default function SpotifyWindow({ onClose, initialPosition = { x: 150, y: 80 }, zIndex = 100, onFocus, triggerClose }) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const windowRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    // C418 Minecraft Volume Alpha album
    const spotifyAlbumId = '3Gt7rOjcZQoHCfnKl5AkK7';

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

    useEffect(() => {
        if (triggerClose && !isClosing) {
            handleClose();
        }
    }, [triggerClose]);

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

    const handleMouseDown = (e) => {
        if (e.target.closest('.window-control-btn') ||
            e.target.closest('button') ||
            e.target.closest('iframe')) return;

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
            className="spotify-window"
            style={{ left: position.x, top: position.y, cursor: isDragging ? 'grabbing' : 'grab', zIndex: zIndex }}
            onMouseDown={handleMouseDown}
            onClick={handleWindowClick}
        >
            <div className="spotify-frame">
                {/* Title Bar */}
                <div className="spotify-titlebar">
                    <div className="spotify-window-controls">
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
                    <div className="spotify-title">
                        <span>Minecraft - Volume Alpha</span>
                    </div>
                </div>

                {/* Spotify Embed */}
                <div className="spotify-content">
                    <iframe
                        src={`https://open.spotify.com/embed/album/${spotifyAlbumId}?utm_source=generator&theme=0`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        title="Spotify Embed"
                    />
                </div>

                {/* Status Bar */}
                <div className="spotify-statusbar">
                    <span>Spotify</span>
                </div>
            </div>
        </div>
    );
}
