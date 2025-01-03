const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');
const { addDynamicIconSelectors } = require('@iconify/tailwind');
const Colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    join(__dirname, 'libs/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
    './node_modules/@glance-ui/**/*.{js,mjs,ts,html}',
  ],
  theme: {
    colors: {
      ...Colors,
      primary: Colors.teal,
    },
  },
  plugins: [addDynamicIconSelectors()],
};
