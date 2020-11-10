import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: './src/registerPlugin.ts',
  output: {
    file: './dist/Ride Price Manager.js',
    format: 'iife',
  },
  plugins: [
    typescript(),
    terser({
      format: {
        quote_style: 1,
        wrap_iife: true,
        preamble: '// Mod powered by https://github.com/wisnia74/openrct2-typescript-mod-template - MIT license',
      },
    }),
  ],
};
