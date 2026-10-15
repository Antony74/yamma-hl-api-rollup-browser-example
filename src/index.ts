import { createUnifier, parseMmp, type UnifierConfig } from 'yamma-hl-api';
import { getElementById } from './getElementById';

const { mmEditor } = getElementById('mmEditor', 'TEXTAREA');
const { parseButton } = getElementById('parseButton');
const { parseOutput } = getElementById('parseOutput');
const { mmpEditor } = getElementById('mmpEditor', 'TEXTAREA');
const { unifyButton } = getElementById('unifyButton');
const { unifierOutput } = getElementById('unifierOutput');

const config: UnifierConfig = { mm: { singleThread: true } };

let unifier = createUnifier('', config);

const parse = (): boolean => {
    try {
        unifier = createUnifier(mmEditor.value, config);
        parseOutput.textContent = 'Parse OK';
        return true;
    } catch (e) {
        if (e instanceof Error) {
            parseOutput.textContent = e.message;
        } else {
            parseOutput.textContent = 'Unknown error';
        }

        return false;
    }
};

parseButton.onclick = parse;

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

unifyButton.onclick = async () => {
    try {
        const parseResult = parse();

        if (parseResult == true) {
            const result = await unifier.unify(mmpEditor.value);
            mmpEditor.value = result.text;

            // Re-parse the mmp file because we need the diagnostics from after unification rather than before
            // const mmpParser = parseMmp(result.text, unifier.mmParser);

            // unifierOutput.textContent = JSON.stringify(
            //     mmpParser.diagnostics,
            //     null,
            //     4,
            // );
        }
    } catch (e) {
        if (e instanceof Error) {
            unifierOutput.textContent = e.message;
        } else {
            unifierOutput.textContent = 'Unknown error';
        }
    }
};
