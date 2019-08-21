import {terser} from 'rollup-plugin-terser';
import * as meta from './package.json';

const config = {
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
  plugins: [],
};

export default [
  config,
  {
    ...config,
    output: {
      ...config.output,
      file: meta.unpkg,
    },
    plugins: [
      ...config.plugins,
      terser({
        output: {
          preamble: config.output.banner,
        },
      }),
    ],
  },
];
