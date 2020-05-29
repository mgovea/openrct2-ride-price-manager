import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const extensions = ['.js', '.ts'];

export default {
    input: 'src/index.ts',
    output: {
        format: 'iife',
    },
    plugins: [
        babel({
            extensions,
            include: ['src/**/*'],
        }),
        typescript(),
        resolve({
            extensions,
        }),
    ],
};
