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
 * Dead-code gate — flags exported GraphQL operations with no callers.
 *
 * Usage:
 *   node scripts/dead-code-gate.mjs [--root=graphql] [--update-baseline]
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const hit = args.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};
const updateBaseline = args.includes('--update-baseline');
const root = getArg('root', 'graphql');
const baselinePath = path.resolve(process.cwd(), 'dead-code-baseline.json');

const EXPORT_GQL_RE = /export\s+const\s+([A-Z][A-Z0-9_]*)\s*=\s*gql\s*`/g;

const SKIP_DIRS = new Set(['node_modules', '__generated__']);

const walkGraphql = (dir, base = dir) => {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      files.push(...walkGraphql(full, base));
    } else if (entry.name.endsWith('.ts') && entry.name !== 'generated.ts') {
      files.push({
        rel: path.relative(base, full).replaceAll('\\', '/'),
        full,
      });
    }
  }
  return files;
};

const walkSource = (dirs) => {
  const files = [];
  for (const relDir of dirs) {
    const dir = path.resolve(process.cwd(), relDir);
    if (!fs.existsSync(dir)) continue;
    const stack = [dir];
    while (stack.length) {
      const current = stack.pop();
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) {
          if (SKIP_DIRS.has(entry.name) || entry.name === '.next') continue;
          stack.push(full);
        } else if (/\.(ts|tsx)$/.test(entry.name)) {
          files.push(full);
        }
      }
    }
  }
  return files;
};

const graphqlRoot = path.resolve(process.cwd(), root);
if (!fs.existsSync(graphqlRoot)) {
  console.error(`dead-code-gate: root not found: ${graphqlRoot}`);
  process.exit(1);
}

const gqlFiles = walkGraphql(graphqlRoot);
const sourceFiles = walkSource(['app', 'components', 'hooks', 'lib', 'graphql']);
const fileContents = new Map(
  sourceFiles.map((f) => [f, fs.readFileSync(f, 'utf8')]),
);

const orphans = [];

for (const { rel, full } of gqlFiles) {
  const content = fs.readFileSync(full, 'utf8');
  let match;
  EXPORT_GQL_RE.lastIndex = 0;
  while ((match = EXPORT_GQL_RE.exec(content)) !== null) {
    const name = match[1];
    const nameRe = new RegExp(`\\b${name}\\b`);
    let used = false;

    for (const [filePath, fileContent] of fileContents) {
      if (filePath === full) continue;
      if (nameRe.test(fileContent)) {
        used = true;
        break;
      }
    }

    if (!used) orphans.push({ name, file: rel });
  }
}

console.log(`\n🧹 dead-code-gate — graphql root: ${root}`);
console.log(`   orphan GraphQL exports: ${orphans.length}`);
for (const { name, file } of orphans.slice(0, 25)) {
  console.log(`   - ${name} (${file})`);
}
if (orphans.length > 25) {
  console.log(`   ... and ${orphans.length - 25} more`);
}

let baseline = orphans.length;
if (fs.existsSync(baselinePath)) {
  const data = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  baseline = data.count ?? orphans.length;
}

if (updateBaseline) {
  fs.writeFileSync(
    baselinePath,
    `${JSON.stringify(
      { count: orphans.length, updatedAt: new Date().toISOString() },
      null,
      2,
    )}\n`,
  );
  console.log(
    `\n✅ Baseline updated to ${orphans.length} in dead-code-baseline.json\n`,
  );
  process.exit(0);
}

if (orphans.length > baseline) {
  console.error(
    `\n❌ dead-code-gate failed: ${orphans.length} orphans exceeds baseline ${baseline}\n`,
  );
  process.exit(1);
}

console.log(`\n✅ dead-code-gate passed (baseline: ${baseline})\n`);
