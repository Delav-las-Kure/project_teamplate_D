module.exports = {
  '**/*.{js,jsx,ts,tsx,md,css,sass,scss}': (filenames) =>
    filenames.map((filename) => `prettier --write '${filename}'`),
  // Run type-check on changes to TypeScript files
  '**/*.ts?(x)': (filenames) => (
    console.log(filenames),
    filenames.map((filename) => `npx tsc ${filename} --pretty --noEmit`)
  ),
  // Run ESLint on changes to JavaScript/TypeScript files
  '**/*.(ts|js)?(x)': (filenames) => `npm run lint ${filenames.join(' ')}`,
}
