import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "בת מלך",
    short_name: "בת מלך",
    description: "מערכת ניהול לארגון נוער חב\"ד",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    dir: "rtl",
    lang: "he",
    icons: [
      {
        src: "/logo-bat-melech.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

