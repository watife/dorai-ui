module.exports = {
  presets: [
    '@babel/preset-react',
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/typescript'
  ],
  plugins: ['@babel/plugin-transform-react-jsx']
}
