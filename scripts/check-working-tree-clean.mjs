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
 * Fails if the git working tree has staged or unstaged changes.
 * Used in verify:go before release audit.
 */
import { execSync } from 'node:child_process';

const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
if (status) {
  console.error('Working tree is not clean — commit or revert before verify:go:\n');
  console.error(status);
  process.exit(1);
}
console.log('Working tree clean.');
