import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from "rollup-plugin-terser";

export default {
    input: 'src/server.js',
    output: {
        file: 'build/bundle.js',
        format: 'umd',
    },
    plugins: [nodeResolve(), terser()]
};