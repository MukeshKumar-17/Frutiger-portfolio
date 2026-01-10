import React, { useState, useEffect } from 'react';
import './TopBar.css';

export default function TopBar({ onOpenProjects, onOpenContact, onOpenResume }) {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="top-bar">
            <img src="/glassapple.png" alt="Logo" className="corner-logo" />
            <div className="menu-items">
                <span
                    className="menu-item link-item"
                    onClick={onOpenProjects}
                    style={{ color: '#000000', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Mukesh's Portfolio
                </span>
                <span
                    className="menu-item"
                    onClick={onOpenContact}
                    style={{ cursor: 'pointer' }}
                >
                    Contact
                </span>
                <span
                    className="menu-item"
                    onClick={onOpenResume}
                    style={{ cursor: 'pointer' }}
                >
                    Resume
                </span>
            </div>
            <div className="right-items">
                <span className="menu-item">Mon {time}</span>
                <span className="menu-item">Macintosh HD</span>
            </div>
        </div>
    );
}
