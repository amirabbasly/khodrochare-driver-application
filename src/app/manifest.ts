import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "خودرو چاره | ناوگان امداد و سفیران",
    short_name: "خودرو چاره ناوگان",
    description: "دریافت بار، تالار ایرانشهر و خدمات ویژهٔ امدادگران و سفیران خودرو چاره.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait-primary",
    background_color: "#112a38",
    theme_color: "#112a38",
    lang: "fa",
    dir: "rtl",
    categories: ["auto", "business", "productivity"],
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
