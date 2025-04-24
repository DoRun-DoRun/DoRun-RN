module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:prettier/recommended', 'prettier'],
  rules: {
    'react-native/no-inline-styles': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
