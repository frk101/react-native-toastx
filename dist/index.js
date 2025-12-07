"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ToastHost: () => ToastHost,
  toast: () => toast
});
module.exports = __toCommonJS(index_exports);

// src/ToastHost.tsx
var import_react = __toESM(require("react"));
var import_react_native = require("react-native");
var import_react_native_reanimated = __toESM(require("react-native-reanimated"));
var import_react_native_safe_area_context = require("react-native-safe-area-context");

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
var SCREEN_WIDTH = import_react_native.Dimensions.get("window").width;
var GAP = 10;
var ENTER_Y = 24;
var DURATION = 300;
var DEFAULT_DURATION = 2200;
var ToastHost = ({
  maxVisible = 3,
  theme
}) => {
  const [queue, setQueue] = (0, import_react.useState)([]);
  const idRef = (0, import_react.useRef)(1);
  const insets = (0, import_react_native_safe_area_context.useSafeAreaInsets)();
  const enqueue = (0, import_react.useCallback)(
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
  (0, import_react.useEffect)(() => {
    registerToastHost(enqueue);
  }, [enqueue]);
  return /* @__PURE__ */ import_react.default.createElement(
    import_react_native.View,
    {
      pointerEvents: "box-none",
      style: [import_react_native.StyleSheet.absoluteFill, { zIndex: 9999 }]
    },
    /* @__PURE__ */ import_react.default.createElement(
      import_react_native.View,
      {
        pointerEvents: "box-none",
        style: [styles.topWrap, { top: insets.top + 12 }]
      },
      queue.filter((i) => i.position === "top").map((item, idx) => /* @__PURE__ */ import_react.default.createElement(
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
    /* @__PURE__ */ import_react.default.createElement(
      import_react_native.View,
      {
        pointerEvents: "box-none",
        style: [styles.bottomWrap, { bottom: insets.bottom + 12 }]
      },
      queue.filter((i) => i.position === "bottom").map((item, idx) => /* @__PURE__ */ import_react.default.createElement(
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
  const translateY = (0, import_react_native_reanimated.useSharedValue)(
    item.position === "top" ? -ENTER_Y : ENTER_Y
  );
  const opacity = (0, import_react_native_reanimated.useSharedValue)(0);
  (0, import_react.useEffect)(() => {
    translateY.value = (0, import_react_native_reanimated.withTiming)(0, { duration: DURATION });
    opacity.value = (0, import_react_native_reanimated.withTiming)(1, { duration: DURATION });
    const exit = () => {
      translateY.value = (0, import_react_native_reanimated.withTiming)(
        item.position === "top" ? -ENTER_Y : ENTER_Y,
        { duration: DURATION }
      );
      opacity.value = (0, import_react_native_reanimated.withTiming)(0, { duration: DURATION }, (finished) => {
        if (finished) {
          (0, import_react_native_reanimated.runOnJS)(onDone)(item.id);
        }
      });
    };
    const t = setTimeout(exit, item.durationMs);
    return () => clearTimeout(t);
  }, []);
  const style = (0, import_react_native_reanimated.useAnimatedStyle)(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value
  }));
  const colorSet = getColors(item.type, theme);
  const horizontalInset = Math.max(insets.left, 0) + Math.max(insets.right, 0);
  const maxWidth = SCREEN_WIDTH - 24 - horizontalInset;
  return /* @__PURE__ */ import_react.default.createElement(
    import_react_native_reanimated.default.View,
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
    /* @__PURE__ */ import_react.default.createElement(import_react_native.View, { style: styles.dotWrap }, /* @__PURE__ */ import_react.default.createElement(import_react_native.View, { style: [styles.dot, { backgroundColor: colorSet.dot }] })),
    /* @__PURE__ */ import_react.default.createElement(import_react_native.View, { style: styles.contentWrapper }, !!item.title && /* @__PURE__ */ import_react.default.createElement(
      import_react_native.Text,
      {
        style: [styles.title, { color: colorSet.fg }],
        numberOfLines: 1
      },
      item.title
    ), item.message && /* @__PURE__ */ import_react.default.createElement(import_react_native.Text, { style: [styles.text, { color: colorSet.fg }], numberOfLines: 3 }, item.message))
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
var styles = import_react_native.StyleSheet.create({
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ToastHost,
  toast
});
