import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "خودرو چاره | همراه هوشمند خودرو",
    short_name: "خودرو چاره",
    description: "یک تماس، یک چاره؛ خدمات خودرو چاره همیشه همراه توست.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait-primary",
    background_color: "#112a38",
    theme_color: "#112a38",
    lang: "fa",
    dir: "rtl",
    categories: ["auto", "utilities", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
