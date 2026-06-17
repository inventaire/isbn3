import { defineConfig } from 'tsdown'

// The package is `"type": "module"`, so with `fixedExtension: false` ESM keeps
// the `.js` extension and CJS gets `.cjs` (and `.d.ts` / `.d.cts` for types).
export default defineConfig([
  {
    // Library entry: dual ESM + CJS so both `import` and `require` consumers work.
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    target: 'node18',
    fixedExtension: false,
    dts: true,
    clean: true,
  },
  {
    // CLIs are executed with `node` directly, so ship them as ESM only.
    // tsdown preserves the `#!/usr/bin/env node` shebang present in the entries.
    entry: {
      'bin/isbn': 'src/bin/isbn.ts',
      'bin/isbn-audit': 'src/bin/isbn-audit.ts',
      'bin/isbn-checksum': 'src/bin/isbn-checksum.ts',
    },
    format: ['esm'],
    target: 'node18',
    fixedExtension: false,
    dts: false,
  },
])
