// getElementById wrapper, with types and exceptions (including a return type to keep variable names in sync ids)

export const getElementById = <K extends string, V extends HTMLElement>(
    elementType: { new (): V },
    id: K,
): Record<K, V> => {
    const elm = document.getElementById(id);

    if (elm instanceof elementType) {
        return { [id]: elm } as Record<K, V>;
    } else if (elm === null) {
        throw new Error(`Element ${id} not found`);
    } else {
        throw new Error(`Element ${id} is of unexpected type, ${elm.nodeName}`);
    }
};
