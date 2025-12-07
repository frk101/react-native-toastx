export type ToastType = "success" | "error" | "info";
export type ToastPosition = "top" | "bottom";

export type ToastOptions = {
  message: string;
  title?: string;
  type?: ToastType;
  durationMs?: number;
  position?: ToastPosition;
};

export type ToastColorSet = {
  bg: string;
  fg: string;
  border: string;
  dot: string;
};

export type ToastTheme = Partial<Record<ToastType, Partial<ToastColorSet>>>;
