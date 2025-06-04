import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      // Ignore text editor components as they are third-party
      "src/components/website/about/text-editor/**/*",
      // Ignore build output
      ".next/**/*",
      "out/**/*",
      "build/**/*",
      "dist/**/*",
      // Ignore dependencies
      "node_modules/**/*",
      // Ignore generated files
      "**/*.generated.*",
      "**/*.min.js",
      // Ignore test files
      "**/*.test.*",
      "**/*.spec.*",
      // Ignore environment files
      ".env*",
      ".env.*"
    ]
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
