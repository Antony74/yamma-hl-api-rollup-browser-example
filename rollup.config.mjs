import path from 'path';
import ts from 'typescript';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
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
].map((find) => {
    return { find, replacement };
});

const transpileTypescript = {
    name: 'transpile-typescript',
    transform(code, id) {
        if (!id.endsWith('.ts')) {
            return null;
        }

        const result = ts.transpileModule(code, {
            fileName: id,
            reportDiagnostics: true,
            compilerOptions: {
                module: ts.ModuleKind.ESNext,
                target: ts.ScriptTarget.ES2022,
            },
        });
        const errors = result.diagnostics.filter(
            (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
        );

        if (errors.length > 0) {
            this.error(
                ts.formatDiagnostics(errors, {
                    getCurrentDirectory: () => process.cwd(),
                    getCanonicalFileName: (fileName) => fileName,
                    getNewLine: () => '\n',
                }),
                id,
            );
        }

        return result.outputText;
    },
};

export default {
    input: 'src/index.ts',
    output: {
        dir: 'dist',
    },
    plugins: [
        alias({
            entries: [
                {
                    find: 'yamma-hl-api',
                    replacement: path.resolve(
                        'node_modules/yamma-hl-api/src/index.ts',
                    ),
                },
                {
                    find: 'buffer',
                    replacement: path.resolve('node_modules/buffer/index.js'),
                },
                {
                    find: 'worker_threads',
                    replacement: path.resolve(
                        'src/polyfills/worker-threads.js',
                    ),
                },
                ...['events', 'stream'].map((find) => {
                    return {
                        find,
                        replacement: path.resolve(
                            'node_modules/events/events.js',
                        ),
                    };
                }),
                ...emptyReplacements,
            ],
        }),
        inject({
            Buffer: ['buffer', 'Buffer'],
        }),
        transpileTypescript,
        resolve({
            browser: true,
            extensions: ['.mjs', '.js', '.json', '.node', '.ts'],
        }),
        commonjs(),
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
