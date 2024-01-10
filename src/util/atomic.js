import { Mutex } from 'async-mutex';
const __tx_mtx = new Mutex();

export async function atomic(promise) {
    let ret = undefined;
    await __tx_mtx.acquire();
    try {
        ret = await promise();
    } finally {
        __tx_mtx.release();
    }
    return ret;
}