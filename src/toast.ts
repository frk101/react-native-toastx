import { ToastOptions } from "./types";

export type ShowFn = (opts: ToastOptions) => void;

let _show: ShowFn | null = null;

/**
 * Bu fonksiyon, bir Toast host'u kaydetmek için kullanılır.
 * Paket kullanıcıları isterse kendi host'larını yazıp bunu kullanabilir.
 */
export function registerToastHost(show: ShowFn) {
  _show = show;
}

export const toast = {
  show(opts: ToastOptions) {
    if (!_show) {
      // Host henüz mount edilmemişse sessizce ignore ediyoruz
      return;
    }
    _show(opts);
  },
};
