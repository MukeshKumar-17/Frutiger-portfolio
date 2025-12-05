import React, { useState, useEffect } from 'react';
import './TopBar.css';

export default function TopBar() {
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
            <span className="apple-logo"></span>
            <div className="menu-items">
                <span className="menu-item bold">Grab</span>
                <span className="menu-item">File</span>
                <span className="menu-item">Edit</span>
                <span className="menu-item">Capture</span>
                <span className="menu-item">Window</span>
                <span className="menu-item">Help</span>
            </div>
            <div className="right-items">
                <span className="menu-item">Mon {time}</span>
                <span className="menu-item">Macintosh HD</span>
            </div>
        </div>
    );
}
