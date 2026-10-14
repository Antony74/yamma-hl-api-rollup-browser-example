import { createUnifier, type UnifierConfig } from 'yamma-hl-api';

const getElement = <T extends Record<string, HTMLElement>>(id: keyof T): T => {
    const elm = document.getElementById(String(id));
    if (elm instanceof HTMLElement) {
        return { [id]: elm } as T;
    } else {
        throw new Error(`Element ${String(id)} not found`);
    }
};

const getTextArea = <T extends Record<string, HTMLTextAreaElement>>(id: keyof T): T => {
    const result = getElement<T>(id);
    if (result instanceof HTMLTextAreaElement) {
        return result;
    } else {
        throw new Error(`Element ${String(id)} is not a text area`);
    }
};

const { mmEditor } = getTextArea<{ mmEditor: HTMLTextAreaElement }>('mmEditor');
const { parseButton } = getElement<{ parseButton: HTMLElement }>('parseButton');
const { parseOutput } = getElement<{ parseOutput: HTMLElement }>('parseOutput');
const { mmpEditor } = getTextArea<{ mmpEditor: HTMLTextAreaElement }>('mmpEditor');
const { unifyButton } = getElement<{ unifyButton: HTMLElement }>('unifyButton');
const { unifierOutput } = getElement<{ unifierOutput: HTMLElement }>('unifierOutput');

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

