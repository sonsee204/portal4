import type { CodegenConfig } from '@graphql-codegen/cli';

const schemaPath = process.env.GRAPHQL_SCHEMA_PATH || './schema.gql';

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
      plugins: [
        'typescript',
        'typescript-operations',
      ],
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
