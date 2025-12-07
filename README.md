# rn-toast-message

Bu paket, React Native uygulamalarınız için basit ve özelleştirilebilir bir toast mesajı bileşeni sağlar.

## Kurulum

```bash
npm install rn-toast-message
```

veya

```bash
yarn add rn-toast-message
```

Ayrıca, `react-native-reanimated` ve `react-native-safe-area-context` paketlerinin kurulu olduğundan emin olun.

```bash
npm install react-native-reanimated react-native-safe-area-context
```

## Kullanım

🚀 Kullanım
Uygulamanın en üst seviyesine <ToastHost /> ekleyin:

```tsx
// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ToastHost } from "rn-toast-message";

export default function App() {
  return (
    <>
      <NavigationContainer />
      <ToastHost />
    </>
  );
}
```

Herhangi bir yerden toast göstermek için:

```tsx
import { toast } from "rn-toast-message";

toast.show({
  type: "success", // "success" | "error" | "info"
  title: "Başarılı!",
  message: "İşlem tamamlandı.",
  position: "top", // "top" | "bottom"
  durationMs: 2500,
});
```

🎨 Tema Desteği (Renk Override)

İstersen yalnızca belirli toast türlerinin renklerini değiştirebilirsin:

```tsx
<ToastHost
  theme={{
    success: {
      bg: "#0A2F1F",
      dot: "#22C55E",
    },
    error: {
      bg: "#450A0A",
    },
    info: {
      bg: "#1E1B4B",
      border: "rgba(59,130,246,0.5)",
    },
  }}
/>
```

Sadece override ettiğin alanlar değişir; diğer değerler default temadan gelir.

## 📘 API

### `Toast.show(options)`

Toast mesajı göstermek için bu fonksiyonu kullanın.

| Seçenek      | Tip                                     | Açıklama                               |
| ------------ | --------------------------------------- | -------------------------------------- |
| `message`    | string                                  | Gösterilecek metin                     |
| `type`       | Toast tipi (`success`, `error`, `info`) | Tema rengine göre stil                 |
| `title`      | string                                  | Küçük başlık                           |
| `durationMs` | number                                  | Toast'un ne kadar süre görüneceği (ms) |
| `position`   | (`top`, `bottom`)                       | Toast konumu                           |

## Örnek:

```tsx
toast.show({
  type: "error",
  title: "Hata!",
  message: "Bir şey ters gitti.",
  position: "bottom",
});
```

### 🧩 Gelişmiş Kullanım — Kendi Toast Host’unu Yaz!

Bu paket, kullanıcıların tamamen kendi UI’lerini yazabilmesi için registerToastHost desteği sağlar.

```tsx
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { registerToastHost, toast, ToastOptions } from "rn-toast-message";

export const CustomToastHost = () => {
  useEffect(() => {
    registerToastHost((opts: ToastOptions) => {
      console.log("Custom toast:", opts);
      // kendi state yönetiminize ekleyip custom UI çizebilirsiniz
    });
  }, []);

  return (
    <View style={{ position: "absolute", top: 40 }}>
      <Text>Ben custom toast host'um</Text>
    </View>
  );
};
```

App’e ekleyin:

```tsx
<>
  <NavigationContainer />
  <CustomToastHost />
</>
```

# 🎨 Varsayılan Tema

success

```tsx
{
  "bg": "#065F46",
  "fg": "#FFFFFF",
  "border": "rgba(16,185,129,0.35)",
  "dot": "#10B981"
}
```

error

```tsx
{
  "bg": "#7F1D1D",
  "fg": "#FFFFFF",
  "border": "rgba(239,68,68,0.35)",
  "dot": "#EF4444"
}
```

info

```tsx
{
  "bg": "#1E3A8A",
  "fg": "#FFFFFF",
  "border": "rgba(59,130,246,0.35)",
  "dot": "#3B82F6"
}
```

# 🤝 Katkı

Pull request ve iyileştirme önerilerine açığız.

# 📄 Lisans

MIT

---
# react-native-toastx
