#!/usr/bin/env node
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
