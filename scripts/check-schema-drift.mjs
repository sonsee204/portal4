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
 * Schema-drift gate — portal schema.gql must match backend source of truth.
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const portalRoot = process.cwd();
const backendSchema = resolve(
  portalRoot,
  '../nalee-sports-backend/src/schema.gql',
);
const portalSchema = resolve(portalRoot, 'schema.gql');

if (!existsSync(backendSchema)) {
  console.error(`check-schema-drift: backend schema not found: ${backendSchema}`);
  process.exit(1);
}

if (!existsSync(portalSchema)) {
  console.error(`check-schema-drift: portal schema not found: ${portalSchema}`);
  process.exit(1);
}

const backend = readFileSync(backendSchema, 'utf8');
const portal = readFileSync(portalSchema, 'utf8');

console.log(
  '\n📐 check-schema-drift — comparing portal schema.gql to backend\n',
);

if (backend !== portal) {
  console.error('❌ check-schema-drift failed: schema.gql is out of date.');
  console.error('   Fix: pnpm run schema:sync && pnpm run codegen\n');
  process.exit(1);
}

console.log('✅ check-schema-drift passed — schema.gql matches backend\n');
