import type { Metadata } from "next";
import React from "react";
import CulinaryNav from "@/components/nav/culinary-nav";

export const metadata: Metadata = {
    title: "Culinary Webpage Example",
    description: "Nice Animation",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <div
                id="page-preloader"
                className="
                    fixed top-0 left-0 w-screen h-screen bg-[#ab722c]
                    flex flex-col justify-center items-center
                    z-[9999]
                    opacity-100 visible
                    transition-opacity duration-500 ease-in-out
                  "
            >
                <p className="text-white text-2xl font-bodoni"> {/* Tailwind for text */}
                    Just a sec...
                </p>
                <div className="animate-spin rounded-full mt-4 h-16 w-16 border-t-2 border-white border-solid shadow-md"></div>
            </div>
            <CulinaryNav/>
            {children}
        </>
    );
}