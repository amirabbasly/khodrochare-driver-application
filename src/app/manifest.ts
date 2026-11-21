import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "خودرو چاره | ناوگان امداد و سفیران",
    short_name: "خودرو چاره ناوگان",
    description: "دریافت بار، اعلام بار و خدمات ویژهٔ امدادگران و سفیران خودرو چاره.",
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
      { src: "/khodrochare-symbol.png", sizes: "600x600", type: "image/png", purpose: "any" },
    ],
  };
}
