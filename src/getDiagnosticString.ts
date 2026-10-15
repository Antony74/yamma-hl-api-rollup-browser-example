import type { MmpParser } from 'yamma-hl-api';

const severityStringArray = [
    'error',
    'error',
    'warning',
    'information',
    'hint',
];

export const getDiagnosticsString = (mmpParser: MmpParser): string => {
    const lines = mmpParser.textToParse.split('\n');

    return mmpParser.diagnostics
        .map(
            ({
                range: {
                    start: { line, character },
                    end,
                },
                severity,
                code,
                message,
            }) => {
                const severityString = severityStringArray[severity ?? 1];

                const lineText = (lines[line] ?? '').replaceAll('\r', '');

                return [
                    `${line}:${character} - ${severityString} ${code} ${message}`,
                    `${line} ${lineText}`,
                    ``,
                ].join('<br>');
            },
        )
        .join('<br>');
};
