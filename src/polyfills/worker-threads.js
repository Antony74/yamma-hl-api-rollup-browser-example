export const isMainThread = true;
export const parentPort = undefined;
export const workerData = undefined;

export class Worker {
    constructor() {
        throw new Error('Worker threads are not available in the browser.');
    }
}
