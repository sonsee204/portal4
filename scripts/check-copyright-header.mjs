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
 * Fails when scoped source files are missing the Ao Trình copyright header.
 *
 * Usage (from repo root):
 *   node scripts/check-copyright-header.mjs [--roots=src]
 *   node scripts/check-copyright-header.mjs --roots=app,components,hooks,lib
 */
import fs from 'node:fs';
import path from 'node:path';

const MARKER = 'Ao Trình (NALee Sports)';

const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

const SKIP_DIR_NAMES = new Set([
  'node_modules',
  '.next',
  'dist',
  'coverage',
  '__generated__',
  '.git',
  'build',
  'Pods',
]);

const SKIP_BASENAMES = new Set(['next-env.d.ts', 'generated.ts', 'graphql.d.ts']);

const SKIP_PATH_SEGMENTS = ['/graphql/generated.ts', '/.next/types/'];

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const hit = args.find(a => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};

const roots = getArg('roots', 'src')
  .split(',')
  .map(r => r.trim())
  .filter(Boolean);

const repoRoot = process.cwd();

const shouldSkip = relPath => {
  const base = path.basename(relPath);
  if (SKIP_BASENAMES.has(base)) return true;
  return SKIP_PATH_SEGMENTS.some(seg => relPath.includes(seg));
};

const walk = (dir, prefix = '') => {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR_NAMES.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...walk(full, rel));
      continue;
    }
    const ext = path.extname(entry.name);
    if (!EXTENSIONS.has(ext)) continue;
    if (shouldSkip(rel)) continue;
    files.push({ rel, full });
  }
  return files;
};

const missing = [];
for (const root of roots) {
  const rootPath = path.resolve(repoRoot, root);
  if (!fs.existsSync(rootPath)) {
    console.error(`check-copyright-header: root not found: ${rootPath}`);
    process.exit(1);
  }
  for (const { rel, full } of walk(rootPath, root)) {
    const content = fs.readFileSync(full, 'utf8');
    if (!content.includes(MARKER)) missing.push(rel);
  }
}

missing.sort();

if (missing.length === 0) {
  console.log(`✅ Copyright header present — roots: ${roots.join(', ')}`);
  process.exit(0);
}

console.error(
  `\n❌ Missing Ao Trình copyright header (${missing.length} file(s), roots: ${roots.join(', ')}):\n`,
);
for (const rel of missing.slice(0, 40)) console.error(`   ${rel}`);
if (missing.length > 40) {
  console.error(`   ... and ${missing.length - 40} more`);
}
console.error('\nFix: pnpm run check:copyright-header after adding header, or node ../scripts/add-copyright-header.mjs\n');
process.exit(1);
