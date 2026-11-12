// getElementById wrapper, with types and exceptions (including a return type to keep variable names in sync ids)

    export const getElementById = <T extends HTMLElement, K extends string>(
        elementType: new (...args: unknown[]) => T,
        id: K,
    ): Record<K, T> => {
        const elm = document.getElementById(id);

        if (elm instanceof elementType) {
            return { [id]: elm } as Record<K, T>;
        } else if (elm === null) {
            throw new Error(`Element ${id} not found`);
        } else {
            throw new Error(`Element ${id} is of unexpected type, ${elm.nodeName}`);
        }
    };

