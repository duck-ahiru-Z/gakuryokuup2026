"use client";

import { useRef, useState, useImperativeHandle, forwardRef, ReactNode } from "react";

export interface FullscreenWrapperRef {
    enterFullscreen: () => Promise<void>;
    exitFullscreen: () => Promise<void>;
    isFullscreen: boolean;
}

interface Props {
    children: ReactNode;
}

export const FullscreenWrapper = forwardRef<FullscreenWrapperRef, Props>(({ children }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVirtualFullscreen, setIsVirtualFullscreen] = useState(false);

  // 外部（親コンポーネント）から呼び出せる関数を定義
    useImperativeHandle(ref, () => ({
    enterFullscreen: async () => {
        if (containerRef.current?.requestFullscreen) {
        // Mac/PC/Androidなど：本物の全画面
        try {
            await containerRef.current.requestFullscreen();
        } catch (e) {
            console.error("Fullscreen error:", e);
        }
        } else {
        // iPhoneなど：CSS疑似全画面
        setIsVirtualFullscreen(true);
        }
    },
    exitFullscreen: async () => {
        if (document.fullscreenElement) {
        await document.exitFullscreen();
        }
        setIsVirtualFullscreen(false);
    },
    isFullscreen: isVirtualFullscreen || !!(typeof document !== "undefined" && document.fullscreenElement),
    }));

  // 疑似全画面用のスタイル（iPhone用）
    const virtualStyle = isVirtualFullscreen
    ? "fixed inset-0 z-50 w-screen h-screen bg-black"
    : "relative w-full h-full";

    return (
    <div ref={containerRef} className={virtualStyle}>
        {children}
    </div>
    );
    });

FullscreenWrapper.displayName = "FullscreenWrapper";