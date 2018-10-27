module.exports = {
  "extends": "airbnb",
  "env": {
    "node": true,
    "browser": true,
  },
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "cmaFeatures": {
      "jsx": true,
      "experimentalObjectRestSpread": true,
    },
    "sourceType": "module"
  },
  "rules": {
    "func-names": ["error", "never"],
    "no-underscore-dangle": 0,
    "no-new": 0,
    "newline-after-var": ["error", "always"],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
  }
};
