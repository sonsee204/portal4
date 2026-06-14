/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/** Legacy offset pagination — shrink allowlist as hooks migrate to cursor. */
const OFFSET_PAGINATION_ALLOWLIST = [
  "hooks/admin/useVenueRequests.ts",
  "hooks/admin/useClaimRequests.ts",
  "hooks/admin/useModeration.ts",
  "hooks/shared/useConnectionPageAfter.ts",
  "hooks/shared/useCursorConnection.ts",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["hooks/**/*.ts"],
    ignores: OFFSET_PAGINATION_ALLOWLIST,
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Identifier[name='PaginationInput']",
          message:
            "Do not use PaginationInput — use CursorPaginationInput with *Connection queries.",
        },
        {
          selector:
            "Property[key.name='page'][value.type='Literal'] ~ Property[key.name='limit']",
          message:
            "Do not use offset { page, limit } — use cursor *Connection pagination.",
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
