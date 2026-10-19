import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  // `**/` also skips build output inside nested agent worktrees under .claude/.
  {
    ignores: [
      "**/.next/**",
      "**/out/**",
      "**/node_modules/**",
      "next-env.d.ts",
      ".claude/**",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
