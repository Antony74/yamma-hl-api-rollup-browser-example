import { createUnifier, parseMmp, type UnifierConfig } from 'yamma-hl-api';
import { getElementById } from './getElementById';
import { getDiagnosticsString } from './getDiagnosticString';

const { mmEditor } = getElementById('mmEditor', 'TEXTAREA');
const { parseButton } = getElementById('parseButton');
const { parseOutput } = getElementById('parseOutput');
const { mmpEditor } = getElementById('mmpEditor', 'TEXTAREA');
const { unifyButton } = getElementById('unifyButton');
const { unifierOutput } = getElementById('unifierOutput');

fetch('example.mm').then((response) => {
    if (response.status >= 400) {
        parseOutput.textContent = `${response.status} ${response.statusText}`;
    } else {
        response.text().then((text) => (mmEditor.value = text));
    }
});

fetch('ununified.mmp').then((response) => {
    if (response.status >= 400) {
        unifierOutput.textContent = `${response.status} ${response.statusText}`;
    } else {
        response.text().then((text) => (mmpEditor.value = text));
    }
});

const config: UnifierConfig = {
    mm: {
        singleThread: true,
        progressCallback: (message) => {
            if (message.kind === 'progress') {
                const progress = message.index / message.count;
                parseOutput.textContent = `deep parsing... ${Math.round(progress * 100)}%`;
            }
        },
    },
};

let unifier = createUnifier('', config);
let parsed = false;

const parse = () => {
    if (!parsed) {
        try {
            unifier = createUnifier(mmEditor.value, config);
            parsed = true;
            parseOutput.textContent = 'Parsed OK';
        } catch (e) {
            if (e instanceof Error) {
                parseOutput.textContent = e.message;
            } else {
                parseOutput.textContent = 'Unknown error';
            }

            parsed = false;
        }
    }
};

parseButton.onclick = parse;

mmEditor.addEventListener('input', () => {
    parsed = false;
});

unifyButton.onclick = async () => {
    try {
        parse();

        if (parsed) {
            const result = await unifier.unify(mmpEditor.value);
            mmpEditor.value = result.text;

            // Re-parse the mmp file because we need the diagnostics from after unification rather than before
            const mmpParser = parseMmp(result.text, unifier.mmParser);

            unifierOutput.innerHTML = getDiagnosticsString(mmpParser);
        }
    } catch (e) {
        if (e instanceof Error) {
            unifierOutput.textContent = e.message;
        } else {
            unifierOutput.textContent = 'Unknown error';
        }
    }
};
