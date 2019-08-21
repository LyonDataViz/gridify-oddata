import {terser} from 'rollup-plugin-terser';
import resolve from 'rollup-plugin-node-resolve';
import * as meta from './package.json';

const umd = {
  input: 'src/index.js',
  output: {
    file: meta.main,
    name: meta.name,
    format: 'umd',
    indent: false,
    extend: true,
    banner: `// ${meta.homepage} v${
      meta.version
    } Copyright ${new Date().getFullYear()} ${meta.author.name}`,
  },
  plugins: [resolve()],
  onwarn: function(warning, warn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      return;
    }
    warn(warning);
  },
};

const umdMin = {
  ...umd,
  output: {
    ...umd.output,
    file: meta.unpkg,
  },
  plugins: [
    ...umd.plugins,
    terser({
      output: {
        preamble: umd.output.banner,
      },
    }),
  ],
};

export default [umd, umdMin];
