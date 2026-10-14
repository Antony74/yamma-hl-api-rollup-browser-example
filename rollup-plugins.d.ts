declare module 'rollup-plugin-copy' {
    export default function copy(options: {
        targets: string[];
        outputFolder: string;
    });
}

declare module 'rollup-plugin-serve' {
    export default function serve(location: string);
}
