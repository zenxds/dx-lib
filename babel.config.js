module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1",
          "ie": "8"
        },
        "loose": true,
        // "useBuiltIns": "usage",
        // "corejs": "3.26.1"
      }
    ]
  ],
  "plugins": ["@babel/plugin-transform-member-expression-literals"]
}