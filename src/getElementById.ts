/**
 * Gets an element by ID and verifies that it has the expected type.
 * 
 * It returns an object containing the element, keyed by its ID.  This
 * is an opinionated guard to help keep variable names aligned to IDs.
 * 
 * Note that document.getElementId may also return an SVG element and this
 * if not properly typed
 * https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/2020
 *
 * @typeParam K - The element ID, used as the key in the returned record.
 * @typeParam V - The expected element type.
 * @param elementType - The element constructor used to validate the result.
 * @param id - The ID of the element to retrieve.
 * @returns An object containing the element, keyed by its ID.
 * @throws {@link Error} If no element with the ID exists or it has an unexpected type.
 */
export const getElementById = <K extends string, V extends HTMLElement>(
    elementType: { new (): V },
    id: K,
): Record<K, V> => {
    const elm = document.getElementById(id);

    if (elm instanceof elementType) {
        return { [id]: elm } as Record<K, V>;
        // That 'as' is annoying https://github.com/microsoft/TypeScript/issues/13948
    } else if (elm === null) {
        throw new Error(`Element ${id} not found`);
    } else {
        throw new Error(`Element ${id} is of unexpected type, ${elm.nodeName}`);
    }
};
