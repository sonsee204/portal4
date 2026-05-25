import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { CodegenConfig } from '@graphql-codegen/cli';

const localSchema = resolve(process.cwd(), 'schema.gql');
const backendSchema = resolve(process.cwd(), '../nalee-sports-backend/src/schema.gql');

const schemaPath =
  process.env.GRAPHQL_SCHEMA_PATH ||
  (existsSync(localSchema)
    ? localSchema
    : existsSync(backendSchema)
      ? backendSchema
      : localSchema);

const config: CodegenConfig = {
  overwrite: true,
  schema: schemaPath,
  documents: [
    'graphql/**/*.ts',
    '!graphql/types/**',
    '!**/node_modules',
  ],
  ignoreNoDocuments: true,
  generates: {
    'graphql/generated.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        enumsAsTypes: false,
        scalars: {
          DateTime: 'string',
          JSON: 'Record<string, unknown>',
        },
      },
    },
  },
};

export default config;
