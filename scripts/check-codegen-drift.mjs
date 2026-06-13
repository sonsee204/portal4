#!/usr/bin/env node
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
