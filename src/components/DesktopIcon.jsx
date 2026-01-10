import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './DesktopIcon.css';

const DesktopIcon = ({ name, icon, onClick, initialPosition = { x: 30, y: 30 } }) => {
    const [isSelected, setIsSelected] = useState(false);

    const handleDoubleClick = () => {
        if (onClick) onClick();
    };

    const handleClick = (e) => {
        e.stopPropagation();
        setIsSelected(true);
    };

    const handleBlur = () => {
        setIsSelected(false);
    };

    return (
        <motion.div
            className={`desktop-icon ${isSelected ? 'selected' : ''}`}
            drag
            dragMomentum={false}
            initial={{ x: initialPosition.x, y: initialPosition.y }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onBlur={handleBlur}
            tabIndex={0}
        >
            <div className="desktop-icon-image">
                <img src={icon} alt={name} draggable={false} />
            </div>
            <span className="desktop-icon-label">{name}</span>
        </motion.div>
    );
};

export default DesktopIcon;
