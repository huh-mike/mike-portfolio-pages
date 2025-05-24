"use client";

import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import {gsap} from "gsap";
import {useGSAP} from "@gsap/react";

const navLinks = [
    { name: "Home", href: "/culinary" },
    { name: "About", href: "/culinary/about" },
    { name: "Contact", href: "/culinary/contact" },
    { name: "Menu", href: "/culinary/menu" },
];

export default function CulinaryNav() {
    const [isOpen, setIsOpen] = useState(false);
    const container = useRef<HTMLElement>(null);
    const tl = useRef<gsap.core.Timeline | null>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useGSAP(() => {
        tl.current = gsap.timeline({paused: true})
            .to("#menuOverlayGsapTarget", {
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
                opacity: 1,
                pointerEvents: 'auto',
                duration: 0.75,
                ease: "power4.inOut",
            })
            .fromTo(
                ".menu-link-item-holder",
                {y: 75, opacity: 0},
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.75,
                    ease: "power4.inOut",
                },
                "-=0.75"
            );
        if (!isOpen) {
            console.log("setting initial state for menu");
        }


    }, { scope: container, dependencies: [] });

    useEffect(() => {
        if (tl.current) {
            if (isOpen) {
                tl.current.play();
            } else {
                tl.current.reverse();
            }
        }
    }, [isOpen]);

    const baseTextStyle = "no-underline uppercase text-sm font-medium leading-[100%]";
    const overlayLinkStyle = `${baseTextStyle} text-black hover:text-neutral-700 block mb-2 md:mb-1`;

    return (
        <nav ref={container} className="relative">
            {/* Menu Bar (Always Visible) */}
            <div className="fixed top-0 left-0 w-screen p-[2em] flex justify-between items-center z-[10] mix-blend-difference">
                <div className="menu-logo">
                    <Link href="/culinary" className="cursor-pointer hover:text-neutral-700 block mb-2 md:mb-1">
                        Ember&Oak
                    </Link>
                </div>
                <div className="menu-open" onClick={toggleMenu}>
                    <p className={`text-white cursor-pointer text-sm font-medium uppercase leading-[100%] hover:text-neutral-700 block mb-2 md:mb-1`}>Navigate</p>
                </div>
            </div>

            {/* Menu Overlay: Always in DOM. Visibility controlled by GSAP & initial Tailwind classes. */}
            <div
                id="menuOverlayGsapTarget"
                // Initial state: hidden, non-interactive, and clipped. GSAP will animate these.
                className="fixed inset-0 p-[2em] bg-[#ab722c] z-[20] flex flex-col
                   opacity-0 pointer-events-none [clip-path:polygon(0%_0%,_100%_0%,_100%_0%,_0%_0%)]"
            >
                {/* Overlay's own top bar */}
                <div className="flex justify-between items-center mb-[2em]">
                    <div className="menu-logo">
                        <Link href="/culinary" className={`cursor-pointer hover:text-neutral-700 text-black block mb-2 md:mb-1`}>
                            Ember&Oak
                        </Link>
                    </div>
                    <div className="menu-close" onClick={toggleMenu}>
                        <p className={`text-black cursor-pointer ${baseTextStyle}`}>Close</p>
                    </div>
                </div>

                {/* Main content area of the overlay */}
                <div className="flex flex-1 w-full">
                    <div
                        className="menu-close-icon flex-[2] flex items-end cursor-pointer"
                        onClick={toggleMenu}
                    >
                        <p className={`text-black ${baseTextStyle} text-[64px]`}>&#x2715;</p>
                    </div>

                    <div className="menu-copy flex-[4] flex flex-col justify-between ml-[2em] mr-[2em]">
                        <div className="menu-links">
                            {navLinks.map((link, index) => (
                                <div className="menu-link-item mb-1 overflow-hidden" key={index}>
                                    <div className="menu-link-item-holder" onClick={toggleMenu}>
                                        <Link href={link.href} className={`uppercase font-medium text-black hover:text-neutral-700 block -mb-1 md:-mb-2 tracking-[-0.04em] text-4xl md:text-7xl`}>
                                            {link.name}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={`menu-info flex flex-col md:flex-row md:justify-between text-xs mt-4 ${baseTextStyle} text-black`}>
                            <div className="menu-info-col mb-4 md:mb-0">
                                <a href="#" target="_blank" rel="noopener noreferrer" className={overlayLinkStyle}>X &#8599;</a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className={overlayLinkStyle}>Instagram &#8599;</a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className={overlayLinkStyle}>LinkedIn &#8599;</a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className={overlayLinkStyle}>Tiktok &#8599;</a>
                                <a href="#" target="_blank" rel="noopener noreferrer" className={`${overlayLinkStyle} mb-0`}>Discord &#8599;</a>
                            </div>
                            <div className="menu-info-col flex flex-col justify-end">
                                <a href="mailto:xu.jiawen.sg@gmail.com" className={overlayLinkStyle}>xu.jiawen.sg@gmail.com</a>
                                <a href="tel:+6585755666" className={`${overlayLinkStyle} mb-0`}>+65 85755666</a>
                            </div>
                        </div>
                    </div>

                    <div className="menu-preview flex-[4] flex justify-end items-end">
                        <p className={`text-black ${baseTextStyle}`}>Contact me for websites</p>
                    </div>
                </div>
            </div>
        </nav>
    );
}