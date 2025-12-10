import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './Welcome.css';

export default function Welcome() {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const portfolioRef = useRef(null);

    useEffect(() => {
        // Initial animation on mount
        const tl = gsap.timeline();

        tl.fromTo('.welcome-letter',
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power3.out',
                stagger: 0.02
            }
        );

        tl.fromTo('.portfolio-letter',
            { opacity: 0, y: 50, rotationX: -90 },
            {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 0.6,
                ease: 'back.out(1.7)',
                stagger: 0.05
            },
            '-=0.5'
        );

        // Setup hover animations for welcome letters
        const welcomeLetters = document.querySelectorAll('.welcome-letter');
        welcomeLetters.forEach((letter) => {
            letter.addEventListener('mouseenter', () => {
                gsap.to(letter, {
                    y: -8,
                    scale: 1.15,
                    color: '#ffffff',
                    textShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(100, 200, 255, 0.6)',
                    duration: 0.25,
                    ease: 'power2.out'
                });
            });

            letter.addEventListener('mouseleave', () => {
                gsap.to(letter, {
                    y: 0,
                    scale: 1,
                    color: '#ffffff',
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                    duration: 0.4,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });

        // Setup hover animations for portfolio letters
        const portfolioLetters = document.querySelectorAll('.portfolio-letter');
        portfolioLetters.forEach((letter) => {
            letter.addEventListener('mouseenter', () => {
                gsap.to(letter, {
                    y: -15,
                    scale: 1.2,
                    color: '#ffffff',
                    textShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(100, 200, 255, 0.6)',
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            letter.addEventListener('mouseleave', () => {
                gsap.to(letter, {
                    y: 0,
                    scale: 1,
                    color: '',
                    textShadow: '',
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.3)'
                });
            });
        });

        // Magnetic effect on mouse move
        const handleMouseMove = (e) => {
            const container = containerRef.current;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) / 50;
            const deltaY = (e.clientY - centerY) / 50;

            gsap.to(portfolioRef.current, {
                x: deltaX,
                y: deltaY,
                duration: 0.5,
                ease: 'power2.out'
            });
        };

        const handleMouseLeave = () => {
            gsap.to(portfolioRef.current, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.3)'
            });
        };

        const container = containerRef.current;
        container.addEventListener('mousemove', handleMouseMove);
        container.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            container.removeEventListener('mousemove', handleMouseMove);
            container.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Split text into individual letters for animation
    const welcomeText = "Hey, I'm MUKESH KUMAR! Welcome to my";
    const portfolioText = 'portfolio';

    return (
        <div className="welcome-container" ref={containerRef}>
            <p className="welcome-line" ref={titleRef}>
                {/* Part 1: Hey, I'm (Italic) */}
                {"Hey, I'm ".split('').map((letter, index) => (
                    <span
                        key={`part1-${index}`}
                        className="welcome-letter italic-text"
                        style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
                    >
                        {letter === ' ' ? '\u00A0' : letter}
                    </span>
                ))}

                {/* Part 2: MUKESH KUMAR! (Normal) */}
                {"MUKESH KUMAR!".split('').map((letter, index) => (
                    <span
                        key={`part2-${index}`}
                        className="welcome-letter"
                        style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
                    >
                        {letter === ' ' ? '\u00A0' : letter}
                    </span>
                ))}

                {/* Part 3: Welcome to my (Italic) */}
                {" Welcome to my".split('').map((letter, index) => (
                    <span
                        key={`part3-${index}`}
                        className="welcome-letter italic-text"
                        style={{ display: letter === ' ' ? 'inline' : 'inline-block' }}
                    >
                        {letter === ' ' ? '\u00A0' : letter}
                    </span>
                ))}
            </p>

            <h1 className="portfolio-title" ref={portfolioRef}>
                {portfolioText.split('').map((letter, index) => (
                    <span
                        key={index}
                        className="portfolio-letter"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        {letter}
                    </span>
                ))}
            </h1>
        </div>
    );
}
