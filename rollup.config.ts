import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
    },
    plugins: [
        resolve({
            browser: true,
            extensions: ['.mjs', '.js', '.json', '.node', '.ts'],
        }),
        commonjs(),
        typescript(),
        copy({
            outputFolder: 'dist',
            targets: [
                'src/index.html',
                'src/example.mm',
                'src/ununified.mmp',
                'node_modules/github-fork-ribbon-css/gh-fork-ribbon.css',
            ],
        }),
        serve('dist'),
    ],
};
