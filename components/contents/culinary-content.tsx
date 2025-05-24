// components/MotionCarousel.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {motion, useAnimation, PanInfo} from 'motion/react';
import {ChevronRightIcon, ChevronLeftIcon} from "lucide-react";
import Image from "next/image";

interface CarouselItemData {
    id: number;
    src: string;
    alt: string;
    title: string;
    description: string;
}

// Sample data - ensure your image paths are correct (e.g., in /public directory)
const carouselItemsData: CarouselItemData[] = [
    { id: 1, src: '/culinary-page/food-one.png', alt: 'Culinary Image 1', title: 'Dish Title 1', description: 'A delightful description of the first culinary masterpiece.' },
    { id: 2, src: '/culinary-page/food-two.png', alt: 'Culinary Image 2', title: 'Savoury Sensation 2', description: 'Explore the rich flavors and textures of our second featured dish.' },
    { id: 3, src: '/culinary-page/food-three.png', alt: 'Culinary Image 3', title: 'Artisan Plate 3', description: 'The third dish combines traditional techniques with modern flair.' },
    { id: 4, src: '/culinary-page/food-four.png', alt: 'Culinary Image 4', title: 'Special Beef Steak', description: 'Indulge in the fourth offering, a carefully crafted dish.' },
    { id: 5, src: '/culinary-page/food-five.png', alt: 'Culinary Image 5', title: "Sphagetti Bolognese", description: "Our final highlight, the chef's special." },
];

const ITEM_VISIBLE_WIDTH = 520; // Width of the main visible item in px
const ITEM_GAP = 0; // Gap between items in px

const MotionCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const controls = useAnimation();
    const viewportRef = useRef<HTMLDivElement>(null);

    const numItems = carouselItemsData.length;

    // Calculate the X offset to center the current item in the viewport
    const calculateXOffset = useCallback((index: number): number => {
        if (!viewportRef.current) return 0;

        const viewportWidth = viewportRef.current.offsetWidth;
        // The X position of the track should be such that the center of the target item
        // aligns with the center of the viewport.
        // Target item's center in track's coordinate system: index * (ITEM_VISIBLE_WIDTH + ITEM_GAP) + ITEM_VISIBLE_WIDTH / 2
        // Desired track offset: viewport_center - item_center_in_track
        const itemCenterInTrack = index * (ITEM_VISIBLE_WIDTH + ITEM_GAP) + ITEM_VISIBLE_WIDTH / 2;
        const viewportCenter = viewportWidth / 2;
        return viewportCenter - itemCenterInTrack;
    }, []);


    // Animate track when currentIndex or viewport width changes
    useEffect(() => {
        const newX = calculateXOffset(currentIndex);
        controls.start({
            x: newX,
            transition: { type: 'spring', stiffness: 350, damping: 35, mass: 0.8 },
        });
    }, [currentIndex, controls, calculateXOffset]);


    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const { offset, velocity } = info;
        const itemSlotWidth = ITEM_VISIBLE_WIDTH + ITEM_GAP;

        // Determine swipe direction and if it's significant enough to change index
        // A more sensitive swipe: combine offset and a bit of projected velocity
        // Negative swipePower means user swiped left (wants to see next item)
        const swipePower = offset.x + velocity.x * 0.15; // Adjust 0.15 to tune velocity sensitivity

        let newIndex = currentIndex;

        if (swipePower < -itemSlotWidth / 3.5) { // Swiped left
            newIndex = Math.min(numItems - 1, currentIndex + 1);
        } else if (swipePower > itemSlotWidth / 3.5) { // Swiped right
            newIndex = Math.max(0, currentIndex - 1);
        }
        // If the swipe isn't strong enough, setCurrentIndex to the same currentIndex
        // This will ensure the useEffect re-runs controls.start() to snap back to the current item's correct position.
        setCurrentIndex(newIndex);
    };

    const navigate = (direction: 'prev' | 'next') => {
        if (direction === 'prev') {
            setCurrentIndex((prev) => Math.max(0, prev - 1));
        } else {
            setCurrentIndex((prev) => Math.min(numItems - 1, prev + 1));
        }
    };

    // Calculate drag constraints to prevent over-dragging significantly
    const getDragConstraints = useCallback(() => {
        if (!viewportRef.current) return { left: 0, right: 0 };
        return {
            left: calculateXOffset(numItems - 1), // Position when last item is centered
            right: calculateXOffset(0),          // Position when first item is centered
        };
    }, [calculateXOffset, numItems]);


    return (
        <div className="relative w-full max-w-5xl mx-auto py-8 select-none">
            <motion.div
                initial={{opacity: 0, y: 50}}
                whileInView={{ opacity: 1, y: 0,transition: {delay:0.5, duration: 1.5 }}}
                ref={viewportRef}
                className="w-full overflow-hidden cursor-grab active:cursor-grabbing"
                // Set a height that accommodates the largest item (scale 1) + some padding
                style={{ height: `${ITEM_VISIBLE_WIDTH * 1.1}px` }}
            >
                <motion.div

                    className="flex items-center" // Vertically align items if their scaled heights differ
                    style={{ gap: `${ITEM_GAP}px` }} // Apply gap using style for precision
                    drag="x"
                    dragConstraints={getDragConstraints()}
                    onDragEnd={handleDragEnd}
                    animate={controls}
                    dragElastic={0.05} // Allow slight overdrag
                    dragMomentum={true} // Enable momentum for a more natural feel
                >
                    {carouselItemsData.map((item, index) => {
                        const rgba = (r: number, g: number, b: number, a: number): string => {
                            return `rgba(${r}, ${g}, ${b}, ${a})`;
                        };

                        const distance = Math.abs(index - currentIndex);
                        let scale = 1;
                        let opacity = 1;
                        let zIndex = 0;
                        let bgColor;

                        if (distance === 0) { // Active item
                            bgColor = '#ab722c';
                            scale = 1;
                            opacity = 1;
                            zIndex = 2;
                        } else if (distance === 1) { // Adjacent items
                            bgColor = rgba(255, 255, 255, 0.2);
                            scale = 0.8;
                            opacity = 0.6;
                            zIndex = 1;
                        } else { // Further items
                            bgColor = rgba(255, 255, 255, 0.2);
                            scale = 0.65;
                            opacity = 0.3;
                            zIndex = 0;
                        }

                        return (
                            <motion.div
                                key={item.id}
                                className="flex-shrink-0 rounded-none drop-shadow-2xl overflow-hidden flex flex-col"
                                style={{
                                    width: `${ITEM_VISIBLE_WIDTH}px`,
                                    height: `${ITEM_VISIBLE_WIDTH* 1.333}px`,
                                    backgroundColor: bgColor,
                                }}
                                animate={{ scale, opacity, zIndex }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            >
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    width={ITEM_VISIBLE_WIDTH}
                                    height={ITEM_VISIBLE_WIDTH*3/5}
                                    className="w-full h-3/5 object-cover pointer-events-none"
                                />
                                <div className="p-4 flex flex-col justify-center items-center flex-grow">
                                    <h3 className="text-3xl font-bodoni mb-4 text-white">{item.title}</h3>
                                    <p className="text-base text-white font-serif line-clamp-2 flex-grow">{item.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </motion.div>

            {/* Navigation Buttons */}
            {numItems > 1 && (
                <>
                    <button
                        onClick={() => navigate('prev')}
                        disabled={currentIndex === 0}
                        aria-label="Previous slide"
                        className="absolute left-0 sm:-left-4 md:-left-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/70 hover:bg-white rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button
                        onClick={() => navigate('next')}
                        disabled={currentIndex === numItems - 1}
                        aria-label="Next slide"
                        className="absolute right-0 sm:-right-4 md:-right-8 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/70 hover:bg-white rounded-full shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        <ChevronRightIcon />
                    </button>
                </>
            )}
        </div>
    );
};

export default MotionCarousel;