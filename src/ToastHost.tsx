/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { toast, registerToastHost } from "./toast";
import { ToastColorSet, ToastOptions, ToastTheme, ToastType } from "./types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GAP = 10;
const ENTER_Y = 24;
const DURATION = 300;
const DEFAULT_DURATION = 2200;

type Item = (ToastOptions & { id: number }) & {
  message: string;
  durationMs: number;
  type: ToastType;
  position: "top" | "bottom";
};

type ToastHostProps = {
  /** Aynı anda maksimum kaç toast görünsün (default: 3) */
  maxVisible?: number;

  /** Renkleri override etmek için tema */
  theme?: ToastTheme;
};

export const ToastHost: React.FC<ToastHostProps> = ({
  maxVisible = 3,
  theme,
}) => {
  const [queue, setQueue] = useState<Item[]>([]);
  const idRef = useRef(1);
  const insets = useSafeAreaInsets();

  const enqueue = useCallback(
    (opts: ToastOptions) => {
      const item: Item = {
        id: idRef.current++,
        message: opts.message,
        title: opts.title,
        type: opts.type ?? "info",
        durationMs: opts.durationMs ?? DEFAULT_DURATION,
        position: opts.position ?? "top",
      };

      // Kuyruğu limitliyoruz (son N taneyi tut)
      setQueue((q) => [...q.slice(-(maxVisible - 1)), item]);
    },
    [maxVisible]
  );

  useEffect(() => {
    registerToastHost(enqueue);
  }, [enqueue]);

  return (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, { zIndex: 9999 }]}
    >
      {/* TOP TOASTLAR */}
      <View
        pointerEvents="box-none"
        style={[styles.topWrap, { top: insets.top + 12 }]}
      >
        {queue
          .filter((i) => i.position === "top")
          .map((item, idx) => (
            <ToastItem
              key={item.id}
              item={item}
              index={idx}
              onDone={(id) => setQueue((q) => q.filter((x) => x.id !== id))}
              insets={insets}
              theme={theme}
            />
          ))}
      </View>

      {/* BOTTOM TOASTLAR */}
      <View
        pointerEvents="box-none"
        style={[styles.bottomWrap, { bottom: insets.bottom + 12 }]}
      >
        {queue
          .filter((i) => i.position === "bottom")
          .map((item, idx) => (
            <ToastItem
              key={item.id}
              item={item}
              index={idx}
              onDone={(id) => setQueue((q) => q.filter((x) => x.id !== id))}
              insets={insets}
              theme={theme}
            />
          ))}
      </View>
    </View>
  );
};

const ToastItem: React.FC<{
  item: Item;
  index: number;
  onDone: (id: number) => void;
  insets: { top: number; bottom: number; left: number; right: number };
  theme?: ToastTheme;
}> = ({ item, index, onDone, insets, theme }) => {
  const translateY = useSharedValue(
    item.position === "top" ? -ENTER_Y : ENTER_Y
  );
  const opacity = useSharedValue(0);

  useEffect(() => {
    // enter animasyonu
    translateY.value = withTiming(0, { duration: DURATION });
    opacity.value = withTiming(1, { duration: DURATION });

    const exit = () => {
      translateY.value = withTiming(
        item.position === "top" ? -ENTER_Y : ENTER_Y,
        { duration: DURATION }
      );
      opacity.value = withTiming(0, { duration: DURATION }, (finished) => {
        if (finished) {
          runOnJS(onDone)(item.id);
        }
      });
    };

    const t = setTimeout(exit, item.durationMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const colorSet = getColors(item.type, theme);

  // yatay güvenli alanları hesaba kat
  const horizontalInset = Math.max(insets.left, 0) + Math.max(insets.right, 0);
  const maxWidth = SCREEN_WIDTH - 24 - horizontalInset;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.toast,
        style,
        {
          backgroundColor: colorSet.bg,
          borderColor: colorSet.border,
          maxWidth,
          elevation: 8,
        },
        item.position === "top"
          ? { marginTop: index ? GAP : 0 }
          : { marginBottom: index ? GAP : 0 },
      ]}
    >
      <View style={styles.dotWrap}>
        <View style={[styles.dot, { backgroundColor: colorSet.dot }]} />
      </View>

      <View style={styles.contentWrapper}>
        {!!item.title && (
          <Text
            style={[styles.title, { color: colorSet.fg }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        )}
        {item.message && (
          <Text style={[styles.text, { color: colorSet.fg }]} numberOfLines={3}>
            {item.message}
          </Text>
        )}
      </View>
    </Animated.View>
  );
};

const defaultColors: Record<ToastType, ToastColorSet> = {
  success: {
    bg: "#065F46",
    fg: "#FFFFFF",
    border: "rgba(16, 185, 129, 0.35)",
    dot: "#10B981",
  },
  error: {
    bg: "#7F1D1D",
    fg: "#FFFFFF",
    border: "rgba(239, 68, 68, 0.35)",
    dot: "#EF4444",
  },
  info: {
    bg: "#1E3A8A",
    fg: "#FFFFFF",
    border: "rgba(59, 130, 246, 0.35)",
    dot: "#3B82F6",
  },
};

function getColors(type: ToastType, theme?: ToastTheme): ToastColorSet {
  const base = defaultColors[type];

  if (!theme || !theme[type]) {
    return base;
  }

  // Kullanıcının verdiği değerleri base ile merge et
  return {
    bg: theme[type]?.bg ?? base.bg,
    fg: theme[type]?.fg ?? base.fg,
    border: theme[type]?.border ?? base.border,
    dot: theme[type]?.dot ?? base.dot,
  };
}

const styles = StyleSheet.create({
  topWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  bottomWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  toast: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    width: SCREEN_WIDTH,
  },
  dotWrap: {
    marginRight: 10,
    paddingTop: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
  },
  contentWrapper: {
    flexShrink: 1,
  },
});
