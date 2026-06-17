import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'bin/isbn': 'src/bin/isbn.ts',
    'bin/isbn-audit': 'src/bin/isbn-audit.ts',
    'bin/isbn-checksum': 'src/bin/isbn-checksum.ts',
  },
  format: ['esm'],
  target: 'node18',
  // The package is `"type": "module"`, so emit `.js` / `.d.ts` (matching the
  // `exports`/`bin` maps) instead of tsdown's default fixed `.mjs` / `.d.mts`.
  fixedExtension: false,
  dts: true,
  clean: true,
  sourcemap: true,
  // tsdown preserves the `#!/usr/bin/env node` shebang present in the bin entry files.
})
