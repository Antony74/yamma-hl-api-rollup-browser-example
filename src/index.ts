import { createUnifier, type UnifierConfig } from 'yamma-hl-api';

const mmEditor = document.getElementById('mmEditor');
const parseButton = document.getElementById('parseButton');
const parserOutput = document.getElementById('unifierOutput');

const mmpEditor = document.getElementById('mmpEditor');
const unifyButton = document.getElementById('unifyButton');
const unifierOutput = document.getElementById('unifierOutput');

if (
    mmEditor &&
    mmEditor instanceof HTMLTextAreaElement &&
    parseButton &&
    parserOutput &&
    mmpEditor &&
    mmpEditor instanceof HTMLTextAreaElement &&
    unifyButton &&
    unifierOutput
) {
    const config: UnifierConfig = { mm: { singleThread: true } };

    let lastMM = '';
    let unifier = createUnifier(lastMM, config);

    const parse = () => {
        if (mmEditor.value !== lastMM) {
            lastMM = mmEditor.value;
            unifier = createUnifier(lastMM, config);
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
            await unifier.unify(mmpEditor.value);
            unifierOutput.textContent = 'Validated OK';
        } catch (e) {
            if (e instanceof Error) {
                unifierOutput.textContent = e.message;
            } else {
                unifierOutput.textContent = 'Unknown error';
            }
        }
    };
} else {
    console.error(
        `Control not found ${JSON.stringify({ mmEditor, parseButton, parserOutput, mmpEditor, unifyButton, unifierOutput }, null, 4)}`,
    );
}
