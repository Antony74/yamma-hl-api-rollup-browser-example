// getElementById wrapper, with types and exceptions

export function getElementById <K extends string>(id: K): Record<K, HTMLElement>;
export function getElementById <K extends string>(id: K, nodeName: 'TEXTAREA'): Record<K, HTMLTextAreaElement>;

export function getElementById <K extends string>(id: K, nodeName?: 'TEXTAREA') {
    const elm = document.getElementById(id);
    if (elm === null) {
        throw new Error(`Element ${id} not found`);
    } else if (nodeName && elm.nodeName !== nodeName) {
        throw new Error(`Element ${id} is not of nodeName ${nodeName}, found ${elm.nodeName}`);
    } else {
        return { [id]: elm } as Record<K, HTMLElement>;
    }
};
