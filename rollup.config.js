import {terser} from 'rollup-plugin-terser';
// import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default [
  {
    input: 'src/js/qiblih.js',
    output: {
      format: 'iife',
      sourcemap: true,
      file: 'public/js/qiblih.js'
    },
    plugins: [
      // nodeResolve(),
      babel({
        babelHelpers: 'bundled'
      }),
      terser()
    ]
  }
];
