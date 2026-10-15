import { createUnifier, type UnifierConfig } from 'yamma-hl-api';
import { getElementById } from './getElementById';

const { mmEditor } = getElementById('mmEditor', 'TEXTAREA');
const { parseButton } = getElementById('parseButton');
const { parseOutput } = getElementById('parseOutput');
const { mmpEditor } = getElementById('mmpEditor', 'TEXTAREA');
const { unifyButton } = getElementById('unifyButton');
const { unifierOutput } = getElementById('unifierOutput');

const config: UnifierConfig = { mm: { singleThread: true } };

let lastMM = '';
let unifier = createUnifier(lastMM, config);

const parse = () => {
    try {
        if (mmEditor.value !== lastMM) {
            lastMM = mmEditor.value;
            unifier = createUnifier(lastMM, config);
        }
    } catch (e) {
        if (e instanceof Error) {
            parseOutput.textContent = e.message;
        } else {
            parseOutput.textContent = 'Unknown error';
        }
    }
};

parseButton.onclick = parse;

fetch('example.mm')
    .then((response) => response.text())
    .then((text) => (mmEditor.value = text));

fetch('ununified.mmp')
    .then((response) => response.text())
    .then((text) => (mmpEditor.value = text));

unifyButton.onclick = async () => {
    try {
        parse();
        const result = await unifier.unify(mmpEditor.value);
        unifierOutput.textContent = JSON.stringify(
            result.mmpUnifier.mmpParser.diagnostics,
            null,
            4,
        );
    } catch (e) {
        if (e instanceof Error) {
            unifierOutput.textContent = e.message;
        } else {
            unifierOutput.textContent = 'Unknown error';
        }
    }
};
