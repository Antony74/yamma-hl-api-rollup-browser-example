import { createUnifier, type UnifierConfig } from 'yamma-hl-api';

const getElementById = <K extends string>(id: K): Record<K, HTMLElement> => {
    const elm = document.getElementById(id);
    if (elm instanceof HTMLElement) {
        return { [id]: elm } as Record<K, HTMLElement>;
    } else {
        throw new Error(`Element ${id} not found`);
    }
};

const getTextAreaById = <K extends string>(
    id: K,
): Record<K, HTMLTextAreaElement> => {
    const elm = document.getElementById(id);
    if (elm instanceof HTMLTextAreaElement) {
        return { [id]: elm } as Record<K, HTMLTextAreaElement>;
    } else {
        throw new Error(`Element ${id} is not a text area`);
    }
};

const { mmEditor } = getTextAreaById('mmEditor');
const { parseButton } = getElementById('parseButton');
const { parseOutput } = getElementById('parseOutput');
const { mmpEditor } = getTextAreaById('mmpEditor');
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
