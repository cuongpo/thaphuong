import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

const page = (path) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  base: "/thaphuong/",
  build: {
    rollupOptions: {
      input: {
        main: page("./index.html"),
        blog: page("./blog/index.html"),
        guide: page("./blog/huong-dan-thap-huong-online/index.html"),
        remembrance: page("./blog/thap-huong-cho-nguoi-da-khuat-o-xa/index.html"),
        incenseMeaning: page("./blog/y-nghia-mot-nen-huong/index.html"),
        peacefulPrayer: page("./blog/loi-nguyen-binh-an/index.html"),
        lunarDays: page("./blog/thap-huong-ngay-ram-mung-mot/index.html")
      }
    }
  }
});
