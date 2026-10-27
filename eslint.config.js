import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
export default [{ignores:['dist/**','Backend/**','admin.js','login.js','script.js','public/**','data/**']},js.configs.recommended,{files:['src/**/*.{js,jsx}','api/**/*.js'],languageOptions:{parserOptions:{ecmaFeatures:{jsx:true}},globals:{...globals.browser,...globals.node}},plugins:{'react-hooks':reactHooks,react},rules:{...reactHooks.configs.recommended.rules,'react/jsx-uses-vars':'error','no-unused-vars':['error',{varsIgnorePattern:'^React$'}]}}];
