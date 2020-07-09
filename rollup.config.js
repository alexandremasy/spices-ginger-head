const path = require('path')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')

const version = process.env.VERSION || require('./package.json').version
const banner =
  `/*!
  * @ginger/head v${version}
  * (c) ${new Date().getFullYear()} Alexandre Masy
  * @license MIT
  */`

const resolve = _path => path.resolve(__dirname, _path)

module.exports = [
  {
    entry: resolve('src/index.js'),
    file: resolve('dist/spices-ginger-head.js'),
    format: 'umd',
    env: 'development'
  },
  {
    entry: resolve('src/index.js'),
    file: resolve('dist/spices-ginger-head.min.js'),
    format: 'umd',
    env: 'production'
  },
  {
    entry: resolve('src/index.js'),
    file: resolve('dist/spices-ginger-head.esm.min.js'),
    format: 'es',
    env: 'production'
  }
].map(config)

function config(opts) {
  const ret = {
    input: opts.entry,
    output: {
      banner,
      format: opts.format,
      file: opts.file,
      name: 'SpicesGingerHead'
    },
    plugins: [
      node(),
      cjs(),
    ]
  }

  return ret;
}