#!/usr/bin/env -S deno run -A

/**
 * This script builds the npm package using dnt (Deno to Node Transform)
 * It transforms Deno code to Node.js compatible code with both ESM and CommonJS support
 */

import { build, emptyDir } from '@deno/dnt';

// Read the current version from deno.json
const denoConfig = JSON.parse(await Deno.readTextFile('./deno.json'));
const version = denoConfig.version;

console.log(`Building npm package v${version}...`);

// Clean the npm output directory
await emptyDir('./npm');

await build({
  entryPoints: ['./src/mod.ts'],
  outDir: './npm',
  shims: {
    // Use Deno shims for compatibility
    deno: true,
  },

  // Generate both ESM and CommonJS
  scriptModule: 'cjs',

  package: {
    name: '@msnkr/data-structures',
    version,
    description:
      'A comprehensive collection of generic data structure implementations for TypeScript/JavaScript, published on npm.',
    license: 'MIT',
    author: {
      name: 'Manuj Sankrit',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/mandy8055/data-structures.git',
    },
    bugs: {
      url: 'https://github.com/mandy8055/data-structures/issues',
    },
    homepage: 'https://github.com/mandy8055/data-structures#readme',
    keywords: [
      'data-structures',
      'typescript',
      'javascript',
      'linked-list',
      'doubly-linked-list',
      'queue',
      'deque',
      'priority-queue',
      'binary-heap',
      'min-heap',
      'max-heap',
      'trie',
      'red-black-tree',
      'sorted-map',
      'lru-cache',
      'bidirectional-map',
      'algorithms',
      'collections',
    ],
    engines: {
      node: '>=14.0.0',
    },
  },

  // Post-build steps
  postBuild() {
    // Copy additional files to npm package
    console.log('Copying additional files...');
    Deno.copyFileSync('LICENSE', 'npm/LICENSE');
    Deno.copyFileSync('README.md', 'npm/README.md');

    // Create a .npmignore file
    Deno.writeTextFileSync(
      'npm/.npmignore',
      [
        '# Source files',
        'src/',
        '*.ts',
        '!*.d.ts',
        '',
        '# Test files',
        '**/*.test.ts',
        '**/*.test.js',
        'tests/',
        '',
        '# Build files',
        'tsconfig.json',
        'script/',
        '',
        '# Development files',
        '.vscode/',
        '.github/',
        'deno.json',
        'deno.lock',
        '',
        '# Coverage',
        'coverage/',
      ].join('\n'),
    );

    console.log('✅ Build complete!');
    console.log(`📦 Package ready in ./npm directory`);
    console.log(`🚀 Version: ${version}`);
  },

  // Type checking
  typeCheck: 'both',

  // Test configuration - skip tests during build since we run them separately
  test: false,

  // Compiler options for the generated package
  compilerOptions: {
    lib: ['ES2021', 'DOM'],
    target: 'ES2021',
  },

  // Map Deno imports to npm packages if needed
  mappings: {},
});

console.log('\n🎉 Build successful!');
console.log('To test locally: cd npm && npm link');
console.log('To publish: cd npm && npm publish --access public');
