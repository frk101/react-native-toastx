// src/ToastHost.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// src/toast.ts
var _show = null;
function registerToastHost(show) {
  _show = show;
}
var toast = {
  show(opts) {
    if (!_show) {
      return;
    }
    _show(opts);
  }
};

// src/ToastHost.tsx
var SCREEN_WIDTH = Dimensions.get("window").width;
var GAP = 10;
var ENTER_Y = 24;
var DURATION = 300;
var DEFAULT_DURATION = 2200;
var ToastHost = ({
  maxVisible = 3,
  theme
}) => {
  const [queue, setQueue] = useState([]);
  const idRef = useRef(1);
  const insets = useSafeAreaInsets();
  const enqueue = useCallback(
    (opts) => {
      var _a, _b, _c;
      const item = {
        id: idRef.current++,
        message: opts.message,
        title: opts.title,
        type: (_a = opts.type) != null ? _a : "info",
        durationMs: (_b = opts.durationMs) != null ? _b : DEFAULT_DURATION,
        position: (_c = opts.position) != null ? _c : "top"
      };
      setQueue((q) => [...q.slice(-(maxVisible - 1)), item]);
    },
    [maxVisible]
  );
  useEffect(() => {
    registerToastHost(enqueue);
  }, [enqueue]);
  return /* @__PURE__ */ React.createElement(
    View,
    {
      pointerEvents: "box-none",
      style: [StyleSheet.absoluteFill, { zIndex: 9999 }]
    },
    /* @__PURE__ */ React.createElement(
      View,
      {
        pointerEvents: "box-none",
        style: [styles.topWrap, { top: insets.top + 12 }]
      },
      queue.filter((i) => i.position === "top").map((item, idx) => /* @__PURE__ */ React.createElement(
        ToastItem,
        {
          key: item.id,
          item,
          index: idx,
          onDone: (id) => setQueue((q) => q.filter((x) => x.id !== id)),
          insets,
          theme
        }
      ))
    ),
    /* @__PURE__ */ React.createElement(
      View,
      {
        pointerEvents: "box-none",
        style: [styles.bottomWrap, { bottom: insets.bottom + 12 }]
      },
      queue.filter((i) => i.position === "bottom").map((item, idx) => /* @__PURE__ */ React.createElement(
        ToastItem,
        {
          key: item.id,
          item,
          index: idx,
          onDone: (id) => setQueue((q) => q.filter((x) => x.id !== id)),
          insets,
          theme
        }
      ))
    )
  );
};
var ToastItem = ({ item, index, onDone, insets, theme }) => {
  const translateY = useSharedValue(
    item.position === "top" ? -ENTER_Y : ENTER_Y
  );
  const opacity = useSharedValue(0);
  useEffect(() => {
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
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value
  }));
  const colorSet = getColors(item.type, theme);
  const horizontalInset = Math.max(insets.left, 0) + Math.max(insets.right, 0);
  const maxWidth = SCREEN_WIDTH - 24 - horizontalInset;
  return /* @__PURE__ */ React.createElement(
    Animated.View,
    {
      pointerEvents: "none",
      style: [
        styles.toast,
        style,
        {
          backgroundColor: colorSet.bg,
          borderColor: colorSet.border,
          maxWidth,
          elevation: 8
        },
        item.position === "top" ? { marginTop: index ? GAP : 0 } : { marginBottom: index ? GAP : 0 }
      ]
    },
    /* @__PURE__ */ React.createElement(View, { style: styles.dotWrap }, /* @__PURE__ */ React.createElement(View, { style: [styles.dot, { backgroundColor: colorSet.dot }] })),
    /* @__PURE__ */ React.createElement(View, { style: styles.contentWrapper }, !!item.title && /* @__PURE__ */ React.createElement(
      Text,
      {
        style: [styles.title, { color: colorSet.fg }],
        numberOfLines: 1
      },
      item.title
    ), item.message && /* @__PURE__ */ React.createElement(Text, { style: [styles.text, { color: colorSet.fg }], numberOfLines: 3 }, item.message))
  );
};
var defaultColors = {
  success: {
    bg: "#065F46",
    fg: "#FFFFFF",
    border: "rgba(16, 185, 129, 0.35)",
    dot: "#10B981"
  },
  error: {
    bg: "#7F1D1D",
    fg: "#FFFFFF",
    border: "rgba(239, 68, 68, 0.35)",
    dot: "#EF4444"
  },
  info: {
    bg: "#1E3A8A",
    fg: "#FFFFFF",
    border: "rgba(59, 130, 246, 0.35)",
    dot: "#3B82F6"
  }
};
function getColors(type, theme) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const base = defaultColors[type];
  if (!theme || !theme[type]) {
    return base;
  }
  return {
    bg: (_b = (_a = theme[type]) == null ? void 0 : _a.bg) != null ? _b : base.bg,
    fg: (_d = (_c = theme[type]) == null ? void 0 : _c.fg) != null ? _d : base.fg,
    border: (_f = (_e = theme[type]) == null ? void 0 : _e.border) != null ? _f : base.border,
    dot: (_h = (_g = theme[type]) == null ? void 0 : _g.dot) != null ? _h : base.dot
  };
}
var styles = StyleSheet.create({
  topWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 12
  },
  bottomWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 12
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
    width: SCREEN_WIDTH
  },
  dotWrap: {
    marginRight: 10,
    paddingTop: 4
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2
  },
  text: {
    fontSize: 14,
    fontWeight: "600"
  },
  contentWrapper: {
    flexShrink: 1
  }
});
export {
  ToastHost,
  toast
};
