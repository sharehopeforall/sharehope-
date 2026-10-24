import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ShareHope",
    short_name: "ShareHope",
    description: "Creating opportunities and building brighter futures.",
    start_url: "/en",
    display: "standalone",
    background_color: "#FAF6ED",
    theme_color: "#0B2D5C",
    icons: [{ src: "/logo-sharehope.png", sizes: "360x100", type: "image/png" }],
  };
}
