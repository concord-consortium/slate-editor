const path = require('path');

module.exports = {
  addons: [
    '@storybook/addon-storysource',
    '@storybook/addon-webpack5-compiler-swc'
  ],
  stories: ['../src/**/*.stories.[tj]s?(x)'],

  webpackFinal: async (config) => {
    config.performance = { hints: false };

    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    // config.resolve.alias['slate-react'] = '@concord-consortium/slate-react';
    config.resolve.extensions.push('.ts', '.tsx');

    return config;
  },

  framework: {
    name: '@storybook/react-webpack5',
    options: {}
  },

  docs: {
    autodocs: false
  },

  typescript: {
    reactDocgen: 'react-docgen-typescript'
  }
};
