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
 * Fails if graphql/generated.ts drifts after running codegen.
 */
import { execSync } from 'node:child_process';

execSync('pnpm run codegen', { stdio: 'inherit' });

const diff = execSync('git diff --name-only graphql/generated.ts', {
  encoding: 'utf8',
}).trim();

if (diff) {
  console.error(
    '\n❌ codegen drift: graphql/generated.ts changed after pnpm codegen — commit regenerated output.\n',
  );
  execSync('git diff --stat graphql/generated.ts', { stdio: 'inherit' });
  process.exit(1);
}

console.log('✅ No codegen drift (graphql/generated.ts).');
