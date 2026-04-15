import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

const noInlineExportPlugin = {
  rules: {
    'no-inline-export': {
      create(context) {
        return {
          ExportDefaultDeclaration(node) {
            if (
              node.declaration.type === 'FunctionDeclaration' ||
              node.declaration.type === 'ClassDeclaration'
            ) {
              context.report({
                node,
                message:
                  'Экспорт должен быть отдельным оператором в конце файла. Используй "export default name;" вместо "export default function name()".',
              });
            }
          },
          ExportNamedDeclaration(node) {
            if (
              node.declaration &&
              (node.declaration.type === 'FunctionDeclaration' ||
                node.declaration.type === 'ClassDeclaration')
            ) {
              context.report({
                node,
                message:
                  'Экспорт должен быть отдельным оператором в конце файла. Используй "export { name };" вместо "export function name()".',
              });
            }
          },
        };
      },
    },
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'src/generated/**']),
  {
    plugins: {
      prettier: prettierPlugin,
      'no-inline-export': noInlineExportPlugin,
    },
    rules: {
      'prettier/prettier': 'warn',
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'no-inline-export/no-inline-export': 'error',
    },
  },
  {
    files: ['jest.config.js', 'tailwind.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);

export default eslintConfig;
