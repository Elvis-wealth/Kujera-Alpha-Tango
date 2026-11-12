import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disallow $queryRawUnsafe and $executeRawUnsafe everywhere (security-rls.md)
      "no-restricted-properties": [
        "error",
        {
          property: "$queryRawUnsafe",
          message: "Use $queryRaw with tagged template literal instead of unsafe string SQL.",
        },
        {
          property: "$executeRawUnsafe",
          message: "Use $executeRaw with tagged template literal instead of unsafe string SQL.",
        },
      ],
      // Disallow value imports of @prisma/client outside src/server/db.ts (security-rls.md)
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@prisma/client",
              message: "Import Prisma Client only in src/server/db.ts. Use type-only imports elsewhere.",
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },
  {
    // src/server/db.ts is the only file allowed to import PrismaClient as a value
    files: ["src/server/db.ts"],
    rules: {
      "@typescript-eslint/no-restricted-imports": "off",
    },
  },
];

export default eslintConfig;
