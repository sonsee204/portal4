import type { CodegenConfig } from '@graphql-codegen/cli';

const schemaPath =
  process.env.GRAPHQL_SCHEMA_PATH ||
  '../nalee-sports-backend/src/schema.gql';

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
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
      },
    },
  },
};

export default config;
