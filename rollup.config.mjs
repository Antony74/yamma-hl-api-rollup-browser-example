import path from 'path';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import alias from '@rollup/plugin-alias';
import inject from '@rollup/plugin-inject';

const replacement = path.resolve('src/polyfills/empty.js');

const emptyReplacements = [
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
});

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
    },
    plugins: [
        alias({
            entries: [
                {
                    find: 'buffer',
                    replacement: path.resolve('node_modules/buffer/index.js'),
                },
                {
                    find: 'process',
                    replacement: path.resolve('src/polyfills/process.js'),
                },
                ...emptyReplacements,
            ],
        }),
        resolve(),
        commonjs(),
        inject({
            Buffer: ['buffer', 'Buffer'],
            process: ['process', 'default'],
        }),
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
