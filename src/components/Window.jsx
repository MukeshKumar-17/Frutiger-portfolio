import React from 'react';
import './Window.css';

export default function Window() {
    return (
        <div className="window-container">
            <div className="window-titlebar">
                <div className="window-controls">
                    <div className="control-btn close-btn"></div>
                    <div className="control-btn min-btn"></div>
                    <div className="control-btn max-btn"></div>
                </div>
                <span className="window-title">About This Mac</span>
            </div>
            <div className="window-content">
                <img src="/mac_x_logo.png" alt="Mac OS X" className="mac-logo" />
                <div className="mac-title">Mac OS X</div>
                <div className="mac-details">
                    Version 10.4.11<br />
                    <br />
                    Processor 1.7 GHz PowerPC G4<br />
                    Memory 320 MB DDR SDRAM<br />
                    Startup Disk Macintosh HD
                </div>
                <button className="blue-btn">Software Update...</button>
                <div className="copyright">
                    TM & © 1983-2001 Apple Computer, Inc.<br />
                    All Rights Reserved.
                </div>
            </div>
        </div>
    );
}
