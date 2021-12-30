/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const mode = process.env.MODE
const name = path.basename(path.resolve('./'))
const pkg = require(path.join(path.resolve('./'), `package.json`))

// pure here means they can be removed if unused (if minifying is on, of course)
const pure =
  mode === 'dev'
    ? []
    : ['console.log', 'console.time', 'console.timeEnd', 'console.timeLog']

// bundle, but set dependencies as external
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
]

const banner = {
  js: `/**
 * @name ${name}
 * @fileoverview ${pkg.description}
 * @version ${pkg.version}
 * @author Boluwatife Fakorede
 * @license MIT
 */
`
}

// CJS
if (pkg.main) {
  require('esbuild').buildSync({
    entryPoints: [path.join(path.resolve('./'), 'lib/index.ts')],
    format: 'cjs',
    bundle: true,
    sourcemap: false,
    target: ['node10.4'],
    outfile: path.join(path.resolve('./'), `dist/${name}.cjs.js`),
    pure,
    banner,
    external
  })
}

// ESM
if (pkg.module) {
  require('esbuild').buildSync({
    entryPoints: [path.join(path.resolve('./'), 'lib/index.ts')],
    format: 'esm',
    bundle: true,
    sourcemap: false,
    target: ['esnext'],
    outfile: path.join(path.resolve('./'), `dist/${name}.esm.js`),
    pure,
    banner,
    external
  })
}
