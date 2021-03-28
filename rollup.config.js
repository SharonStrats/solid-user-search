import pkg from './package.json';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,

      format: 'cjs'
    },

    {
      file: pkg.module,

      format: 'esm'
    }
  ],
  external: [
    'react',
    '@solid/react',
    'tripledoc',
    'solid-auth-client',
    'rdf-namespaces'
  ],
  plugins: [
    typescript({
      // Use our own version of TypeScript, rather than the one bundled with the plugin:
      typescript: require('typescript'),
      tsconfigOverride: {
        compilerOptions: {
          module: 'es2015'
        }
      }
    })
  ]
};
