import path from 'path';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import alias from '@rollup/plugin-alias';

const replacement = path.resolve('src/empty.js');

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
    },
    plugins: [
        resolve(),
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
        alias({
            entries: [
                'util',
                'path',
                'os',
                'crypto',
                'net',
                'url',
                'fs',
                'child_process',
                'readline',
                'stream',
                'events',
                'worker_threads',
            ].map((find) => {
                return { find, replacement };
            }),
        }),
        serve('dist'),
    ],
};
