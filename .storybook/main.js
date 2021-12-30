module.exports = {
  stories: ['../packages/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-actions',
    '@storybook/addon-a11y'
  ],
  framework: '@storybook/react',
  webpackFinal: async (config) => {
    // This is where we change the order of resolution of main fields
    config.resolve.mainFields = ['src', 'module', 'main']

    // Return the altered config
    return config
  }
}
