#!/usr/bin/env node
/**
 * Size gate — reports source files exceeding line thresholds.
 *
 * Usage:
 *   node scripts/size-gate.mjs [--root=src] [--roots=app,components,hooks,lib] [--warn=250] [--error=400] [--strict] [--warn-baseline] [--update-warn-baseline] [--scope=all|maintainability]
 *
 * --roots   Comma-separated roots (overrides --root when set); merges results for baseline.
 * --strict  Exit 1 when any scoped file exceeds --error threshold (for CI).
 * --warn-baseline  Exit 1 when warn-tier count exceeds size-gate-warn-baseline.json.
 * --update-warn-baseline  Write current warn/error counts to baseline file and exit 0.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const hit = args.find(a => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};
const strict = args.includes('--strict');
const warnBaseline = args.includes('--warn-baseline');
const updateWarnBaseline = args.includes('--update-warn-baseline');
const scope = getArg('scope', 'maintainability');
const baselinePath = path.resolve(process.cwd(), 'size-gate-warn-baseline.json');
const root = getArg('root', 'src');
const rootsArg = getArg('roots', '');
const roots = rootsArg
  ? rootsArg.split(',').map(r => r.trim()).filter(Boolean)
  : [root];
const warnAt = Number(getArg('warn', '250'));
const errorAt = Number(getArg('error', '400'));

const EXCLUDED_SEGMENTS = [
  '/__generated__/',
  '/node_modules/',
  '/dist/',
  '/coverage/',
  '/.next/',
];

const EXCLUDED_BASENAMES = new Set([
  'operations.ts',
  'graphql.d.ts',
  'generated.ts',
]);

const EXCLUDED_SUFFIXES = [
  '.spec.ts',
  '.test.ts',
  '.test.tsx',
  '.e2e-spec.ts',
];

const isMaintainabilityTarget = relPath => {
  if (relPath.endsWith('.service.ts')) return true;
  if (relPath.endsWith('.resolver.ts')) return true;
  if (relPath.startsWith('screens/') || relPath.includes('/screens/')) return true;
  if (relPath.startsWith('app/') || relPath.includes('/app/')) return true;
  if (relPath.startsWith('components/') || relPath.includes('/components/')) return true;
  if (relPath.startsWith('hooks/') || relPath.includes('/hooks/')) return true;
  if (relPath.startsWith('lib/') || relPath.includes('/lib/')) return true;
  return false;
};

const isInScope = relPath =>
  scope === 'all' ? true : isMaintainabilityTarget(relPath);

const isExcluded = relPath => {
  if (EXCLUDED_SEGMENTS.some(seg => relPath.includes(seg))) return true;
  const base = path.basename(relPath);
  if (EXCLUDED_BASENAMES.has(base)) return true;
  if (base === 'strings.ts' && relPath.includes('constants/')) return true;
  if (EXCLUDED_SUFFIXES.some(s => relPath.endsWith(s))) return true;
  return false;
};

const countLines = filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  let inBlockComment = false;
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('/**')) {
      inBlockComment = true;
      continue;
    }
    if (inBlockComment) {
      if (trimmed.includes('*/')) inBlockComment = false;
      continue;
    }
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;
    count += 1;
  }
  return count;
};

const walk = (dir, base = dir, prefix = '') => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(base, full).replaceAll('\\', '/');
    const scopedRel = prefix ? `${prefix}/${rel}` : rel;
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '__generated__') continue;
      files.push(...walk(full, base, prefix));
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
      if (!isExcluded(scopedRel)) files.push({ rel: scopedRel, full });
    }
  }
  return files;
};

const collectResults = () => {
  const files = [];
  for (const r of roots) {
    const rootPath = path.resolve(process.cwd(), r);
    if (!fs.existsSync(rootPath)) {
      console.error(`size-gate: root not found: ${rootPath}`);
      process.exit(1);
    }
    files.push(...walk(rootPath, rootPath, r));
  }
  return files
    .map(({ rel, full }) => ({ rel, lines: countLines(full) }))
    .filter(r => isInScope(r.rel) && r.lines > warnAt)
    .sort((a, b) => b.lines - a.lines);
};

const results = collectResults();
const errors = results.filter(r => r.lines > errorAt);
const warns = results.filter(r => r.lines > warnAt && r.lines <= errorAt);

console.log(
  `\n📏 size-gate — roots: ${roots.join(', ')} scope: ${scope} (warn>${warnAt}, error>${errorAt})\n`,
);

if (errors.length) {
  console.log(`❌ ERROR (>${errorAt} lines): ${errors.length} file(s)`);
  for (const { rel, lines } of errors) console.log(`   ${lines.toString().padStart(5)}  ${rel}`);
}

if (warns.length) {
  console.log(`\n⚠️  WARN (>${warnAt} lines): ${warns.length} file(s)`);
  for (const { rel, lines } of warns.slice(0, 30)) {
    console.log(`   ${lines.toString().padStart(5)}  ${rel}`);
  }
  if (warns.length > 30) console.log(`   ... and ${warns.length - 30} more`);
}

if (!errors.length && !warns.length) {
  console.log('✅ All tracked files within thresholds.');
}

console.log(
  `\nSummary: ${errors.length} error(s), ${warns.length} warn(s), ${results.length} total over warn threshold\n`,
);

if (updateWarnBaseline) {
  const payload = {
    count: warns.length,
    errorCount: errors.length,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(baselinePath, JSON.stringify(payload, null, 2) + '\n');
  console.log(
    `✅ Baseline updated — warn: ${warns.length}, error: ${errors.length} in size-gate-warn-baseline.json\n`,
  );
  process.exit(0);
}

if (warnBaseline) {
  let baseline = warns.length;
  if (fs.existsSync(baselinePath)) {
    const data = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    baseline = data.count ?? warns.length;
  }
  console.log(`🔒 warn-baseline: ${warns.length} current, ${baseline} allowed`);
  if (warns.length > baseline) {
    console.error(
      `\n❌ size-gate warn-baseline failed: ${warns.length} > ${baseline}\n`,
    );
    process.exit(1);
  }
}

if (strict && errors.length > 0) {
  let errorBaseline = errors.length;
  if (fs.existsSync(baselinePath)) {
    const data = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    if (typeof data.errorCount === 'number') errorBaseline = data.errorCount;
  }
  console.log(`🔒 error-baseline: ${errors.length} current, ${errorBaseline} allowed`);
  if (errors.length > errorBaseline) process.exit(1);
}
