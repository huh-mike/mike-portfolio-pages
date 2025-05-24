/* components/Hero.tsx */
'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ChevronRightIcon } from 'lucide-react';


export default function CulinaryHero() {
    const scope = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    // ✨ simple fade / slide-up intro
    useGSAP(
        () => {
            const ctx = gsap.context(() => {
                gsap.from('[data-animate="fade"]', {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    ease: 'power2.out',
                    stagger: 0.15,
                });
            }, scope);
            return () => ctx.revert();
        },
        { scope }
    );



    // GSAP Hover animation handlers for the button
    const handleMouseEnter = () => {
        if (buttonRef.current) {
            gsap.to(buttonRef.current, {
                opacity: 0.9, // Your desired hover opacity
                duration: 0.2, // Adjust duration as needed
                ease: 'power1.out',
            });
        }
    };

    const handleMouseLeave = () => {
        if (buttonRef.current) {
            // Animate back to full opacity, assuming it was 1 after the intro
            gsap.to(buttonRef.current, {
                opacity: 1,
                duration: 0.2, // Adjust duration as needed
                ease: 'power1.out',
            });
        }
    };

    return (
        <section
            ref={scope}
            id="hero"
            className="relative flex flex-col w-full min-h-screen overflow-hidden bg-cover bg-[url('/culinary-page/bg.svg')] bg-slate-700/30 bg-blend-multiply text-white md:h-screen md:flex-row"
        >
            {/* ─────────── Left / content ─────────── */}
            <div className="min-w-0 md:basis-3/4">
                <div className="flex flex-col w-full h-full justify-center box-border mt-32 md:mt-0 mb-24 py-12 px-18 md:py-12 md:px-56">
                    <p
                        data-animate="fade"
                        className={`mb-2 text-xs md:text-sm font-extrabold tracking-[2px] md:tracking-[8px] text-[#ab722c] md:mb-4`}
                    >
                        ENJOY GRILL IN NATURE
                    </p>

                    <h1
                        data-animate="fade"
                        className="text-4xl font-bodoni leading-tight md:text-9xl z-2"
                    >
                        Ember&Oak
                    </h1>

                    <p
                        data-animate="fade"
                        className="max-w-prose text-base leading-relaxed mt-6 md:text-lg z-2"
                    >
                        Escape the city, ignite your senses.
                        Discover wood-fired flavors and soulful gatherings at Ember & Oak, hidden deep in Singapore’s wild green heart.
                    </p>
                    <button
                        data-animate="fade"
                        ref={buttonRef}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="flex items-center justify-between bg-[#ab722c] text-white font-serif
                        w-full md:w-[12vw] mt-8 md:mt-16 rounded-full shadow-md overflow-hidden hover:opacity-90
                        focus:outline-none focus:ring-2 focus:ring-custom-gold focus:ring-opacity-50"
                    >
                        <span className="flex-grow items-center translate-x-4 md:translate-x-2 justify-center">
                            Open Menu
                        </span>
                        <div className="bg-slate-700/80 h-6 w-6 m-2 flex items-center justify-center rounded-full">
                            <ChevronRightIcon className="h-4 w-4 text-white" />
                        </div>
                    </button>
                </div>
            </div>

            {/* ─────────── Right ─────────── */}
            <div className="relative flex items-center w-full h-[18vh] md:h-full justify-center bg-[#ab722c] md:basis-1/4">
                {/* platter photo */}
                <Image
                    src="/culinary-page/hero.svg"
                    alt="Assorted appetizers on wooden platter"
                    width={1024}
                    height={1024}
                    priority
                    className="select-none pointer-events-none absolute object-cover max-w-[480px] md:max-w-[680px] md:-translate-x-1/4 z-1"
                />
            </div>
        </section>
    );
}