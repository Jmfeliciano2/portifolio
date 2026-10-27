import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
export default [{ignores:['dist/**','Backend/**','admin.js','login.js','script.js','public/**','data/**']},js.configs.recommended,{files:['src/**/*.{js,jsx}','api/**/*.js'],languageOptions:{globals:{...globals.browser,...globals.node}},plugins:{'react-hooks':reactHooks},rules:{...reactHooks.configs.recommended.rules,'no-unused-vars':['error',{varsIgnorePattern:'^React$'}]}}];
