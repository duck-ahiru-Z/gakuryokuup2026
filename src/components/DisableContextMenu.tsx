import React, { useEffect } from 'react';

interface DisableContextMenuProps {
    children: React.ReactNode;
}

export const DisableContextMenu: React.FC<DisableContextMenuProps> = ({ children }) => {
    useEffect(() => {
    // 右クリック（コンテキストメニュー）のキャンセルハンドラー
    const handleContextMenu = (e: MouseEvent) => {
        e.preventDefault();
    };

    // マウント時にイベント登録
    window.addEventListener('contextmenu', handleContextMenu);

    // アンマウント（ゲーム画面から離れた時）に自動解除
    return () => {
        window.removeEventListener('contextmenu', handleContextMenu);
    };
    }, []);

    return <>{children}</>;
    };