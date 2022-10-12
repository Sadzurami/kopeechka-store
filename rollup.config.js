import typescript from '@rollup/plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'

export default {
  input: 'src/index.ts',
  external: 'node-fetch',
  output: [
    {
      file: './dist/kopeechka.mjs',
      format: 'es'
    },
    {
      file: './dist/kopeechka.js',
      format: 'cjs',
      exports: 'default'
    },
    {
      file: './kopeechka.min.js',
      format: 'iife',
      name: 'Kopeechka',
      interop: false,
      globals: {
        'node-fetch': 'fetch'
      },
      plugins: [uglify()]
    }
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json' })]
}
