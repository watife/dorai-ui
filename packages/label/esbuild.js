#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const esbuild = require('esbuild')

const defaultConfig = {
  entryPoints: [path.join(path.resolve('./'), 'lib/index.ts')],
  bundle: true,
  minify: true
}

esbuild
  .build({
    ...defaultConfig,
    format: 'esm',
    outfile: path.join(path.resolve('./'), `dist/index.esm.js`)
  })
  .catch(() => process.exit(1))

esbuild
  .build({
    ...defaultConfig,
    format: 'cjs',
    outfile: path.join(path.resolve('./'), `dist/index.cjs.js`)
  })
  .catch(() => process.exit(1))
