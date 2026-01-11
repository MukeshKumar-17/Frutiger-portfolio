import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './TiltedContactCard.css';

const springValues = {
    damping: 20,
    stiffness: 200,
    mass: 1
};

export default function TiltedContactCard({ onClose }) {
    const imageSrc = '/silver_chrome_card_bg.png';
    const altText = 'Contact Me';
    const containerHeight = '400px';
    const containerWidth = '100%';
    const imageHeight = '360px'; // 16:9 
    const imageWidth = '640px';
    const scaleOnHover = 1.15;
    const rotateAmplitude = 16;

    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const scale = useSpring(1, springValues);
    const opacity = useSpring(0);
    const rotateFigcaption = useSpring(0, {
        stiffness: 350,
        damping: 30,
        mass: 1
    });

    const [lastY, setLastY] = useState(0);

    function handleMouse(e) {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
        const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);

        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);

        const velocityY = offsetY - lastY;
        rotateFigcaption.set(-velocityY * 0.6);
        setLastY(offsetY);
    }

    function handleMouseEnter() {
        scale.set(scaleOnHover);
        opacity.set(1);
    }

    function handleMouseLeave() {
        opacity.set(0);
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
        rotateFigcaption.set(0);
    }

    return (
        <motion.div
            className="tilted-card-overlay-wrapper"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
            <motion.div
                className="tilted-card-container"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                    type: "tween"
                }}
            >
                <figure
                    ref={ref}
                    className="tilted-card-figure"
                    style={{
                        height: containerHeight,
                        width: containerWidth
                    }}
                    onMouseMove={handleMouse}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >

                    <motion.div
                        className="tilted-card-inner"
                        style={{
                            width: imageWidth,
                            height: imageHeight,
                            rotateX,
                            rotateY,
                            scale
                        }}
                    >
                        <motion.img
                            src={imageSrc}
                            alt={altText}
                            className="tilted-card-img"
                            style={{
                                width: imageWidth,
                                height: imageHeight
                            }}
                        />

                        <motion.div className="tilted-card-content">
                            <div className="card-header">
                                <h2>Get In Touch</h2>
                                <p>Let's build something cool.<br />Or just talk design. Either works.</p>
                            </div>

                            <div className="card-links">
                                <span
                                    className="card-link"
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open('tel:+918608622547', '_self');
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && window.open('tel:+918608622547', '_self')}
                                >
                                    +91 8608622547
                                </span>
                                <span
                                    className="card-link"
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open('mailto:mukeshkumark1755@gmail.com', '_self');
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && window.open('mailto:mukeshkumark1755@gmail.com', '_self')}
                                >
                                    mukeshkumark1755@gmail.com
                                </span>
                                <span
                                    className="card-link"
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open('https://www.linkedin.com/in/mukeshkumark17/', '_blank', 'noopener,noreferrer');
                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && window.open('https://www.linkedin.com/in/mukeshkumark17/', '_blank', 'noopener,noreferrer')}
                                >
                                    LinkedIn
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                </figure>
            </motion.div>
        </motion.div>
    );
}
