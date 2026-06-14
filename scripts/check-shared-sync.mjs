#!/usr/bin/env node

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

/**
 * check-shared-sync.mjs — run from a consumer repo (portal/landing).
 * Verifies this repo matches nalee-sports-web shared kernel for its entries.
 *
 * Usage:
 *   node scripts/check-shared-sync.mjs
 */

import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const repoName = resolve(process.cwd()).split('/').pop();
const workspaceRoot = resolve(process.cwd(), '..');
const syncScript = resolve(workspaceRoot, 'scripts/sync-shared-kernel.mjs');

try {
  execFileSync(
    process.execPath,
    [syncScript, '--check', `--target=${repoName}`],
    { stdio: 'inherit' },
  );
} catch {
  process.exit(1);
}
