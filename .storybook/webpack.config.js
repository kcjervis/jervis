const path = require('path');

module.exports = ({ config, mode }) =>  {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [{
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        experimentalWatchApi: true
      }
    }
    // ,{
    //   loader: 'react-docgen-typescript-loader'
    // }
  ]
  });
  config.resolve.extensions.push('.ts', '.tsx');
  return config;
};