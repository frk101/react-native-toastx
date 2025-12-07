import React from 'react';

type ToastType = "success" | "error" | "info";
type ToastPosition = "top" | "bottom";
type ToastOptions = {
    message: string;
    title?: string;
    type?: ToastType;
    durationMs?: number;
    position?: ToastPosition;
};
type ToastColorSet = {
    bg: string;
    fg: string;
    border: string;
    dot: string;
};
type ToastTheme = Partial<Record<ToastType, Partial<ToastColorSet>>>;

type ToastHostProps = {
    /** Aynı anda maksimum kaç toast görünsün (default: 3) */
    maxVisible?: number;
    /** Renkleri override etmek için tema */
    theme?: ToastTheme;
};
declare const ToastHost: React.FC<ToastHostProps>;

declare const toast: {
    show(opts: ToastOptions): void;
};

export { type ToastColorSet, ToastHost, type ToastOptions, type ToastPosition, type ToastTheme, type ToastType, toast };
