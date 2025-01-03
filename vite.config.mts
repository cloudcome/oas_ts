import dts from 'vite-plugin-dts';
import { externalizeDeps } from 'vite-plugin-externalize-deps';
import { defineConfig } from 'vitest/config';
import pkg from './package.json';

/**
 * vite config
 * @ref https://vitejs.dev/
 * vitest config
 * @ref https://vitest.dev/
 */
export default defineConfig((env) => {
  const isTest = env.mode === 'test';

  return {
    plugins: [
      externalizeDeps({
        deps: true,
        devDeps: true,
        peerDeps: true,
        optionalDeps: true,
        nodeBuiltins: true,
      }),
      dts({
        include: 'src',
      }),
    ],
    define: {
      PKG_NAME: JSON.stringify(isTest ? 'pkg-name-for-test' : pkg.name),
      PKG_VERSION: JSON.stringify(isTest ? 'pkg-version-for-test' : pkg.version),
      PKG_DESCRIPTION: JSON.stringify(isTest ? 'pkg-description-for-test' : pkg.description),
    },
    build: {
      minify: false,
      sourcemap: true,
      copyPublicDir: false,
      reportCompressedSize: false,
      lib: {
        entry: {
          index: 'src/index.ts',
        },
      },
      rollupOptions: {
        output: [
          {
            format: 'esm',
            entryFileNames: '[name].mjs',
            chunkFileNames: '[name].mjs',
          },
          {
            format: 'cjs',
            entryFileNames: '[name].cjs',
            chunkFileNames: '[name].cjs',
          },
        ],
      },
    },
    test: {
      globals: true,
      coverage: {
        all: true,
        include: ['src/**/*.ts'],
        reporter: ['lcov', 'text'],
      },
    },
  };
});
