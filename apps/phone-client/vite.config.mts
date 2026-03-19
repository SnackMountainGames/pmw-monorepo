/// <reference types='vitest' />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const isApp = mode === "app";

  return {
    root: import.meta.dirname,
    cacheDir: "../../node_modules/.vite/apps/phone-client",

    server: {
      port: 4200,
      host: true,
    },

    preview: {
      port: 4200,
      host: "localhost",
    },

    plugins: [react()],

    build: {
      outDir: "./dist",
      emptyOutDir: true,
      reportCompressedSize: true,

      commonjsOptions: {
        transformMixedEsModules: true,
      },

      ...(!isApp && {
        lib: {
          entry: path.resolve(__dirname, "src/index.ts"),
          name: "PhoneClient",
          fileName: "index",
        },
        rollupOptions: {
          external: ["react", "react-dom"],
        },
      }),
    },

    test: {
      name: "phone-client",
      watch: false,
      globals: true,
      environment: "jsdom",
      include: ["{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      reporters: ["default"],
      coverage: {
        reportsDirectory: "./test-output/vitest/coverage",
        provider: "v8" as const,
      },
      setupFiles: `vitest.setup.ts`,
    },
  };
});
