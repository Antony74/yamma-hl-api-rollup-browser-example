import ts from 'typescript';
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';

const transpileTypescript = {
    name: 'transpile-typescript',
    transform(code: string, id: string) {
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

        const errors = (result.diagnostics ?? []).filter(
            (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
        );

        if (errors.length > 0) {
            console.error(
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
