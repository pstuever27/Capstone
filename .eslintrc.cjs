//--------------------------------
// File: .eslintrc.cjs
// Description: Config file autogenerated by ESLint for JS error checking purposes
// Programmer(s): Kieran Delaney
// Created on: 9/21/2023
// Preconditions: Must have npm and node installed. Also this is generated from a VSCode extension, so may need to be using VScode for the in-editor error suggestions 
// Postconditions: Shows errors in VSCode text editor
// Error conditions: All possible Javascript errors that ESLint covers
// Side effects: No known side effects
// Invariants: None
// Faults: None
//--------------------------------
module.exports = { //sets this to all modules
  root: true, // ESLint tracks up to the root directory
  env: { browser: true, es2020: true }, // sets the environment to be browsers and the scripting language version to be es2020
  extends: [ // extensions of the ESLint configuration:
    'eslint:recommended', // extends the ESLint rules as recommended by most developers to be most useful extensions
    'plugin:react/recommended', // extends the rules as recommended for react to be deemed most useful by devs
    'plugin:react/jsx-runtime', // extends the rules for js modules which tells ESlint to use the new JSX transform from react 17
    'plugin:react-hooks/recommended', // extends the recommended rules for react hooks
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'], // ignores error checking for dist and this eslint config file
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' }, // sets the ecma version to the latest, and specifies the parsing source type to be module based
  settings: { react: { version: '18.2' } }, // specifies that the react version is 18.2
  plugins: ['react-refresh'], // uses the react refresh plugin to enable react to rerender code with changes made in real-time without compromising saved states
  rules: { // base rules for eslint error checking
    'react-refresh/only-export-components': [ // within the react refresh rule and the exporting subset
      'warn', // sends warnings when something other than a React JS module is attempted to be exported
      { allowConstantExport: true }, // this overwrites the warnings for constants, so constants (strings, numbers, bools, etc) can be exported without needing to be wrapped in a react component
    ],
  },
}