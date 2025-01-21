//  channel

//  pipeline


export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
export const raf = () => new Promise(resolve => requestAnimationFrame(resolve));
export const ric = opts => new Promise(resolve => requestIdleCallback(resolve, opts));


export async function* createTicker(gap) {
    let c = -1;
    while (true) {
        await sleep(gap);
        yield c += 1;
    }
}

/**
 * @description observable producer
 * @param el
 * @param evtType
 * @returns {{[Symbol.asyncIterator](): AsyncGenerator<*, void, *>}}
 */
export function fromEvent(el, evtType) {
    const aq = new AsyncQueue()

    ;(function setup() {
        aq.enqueue();
    })();

    el.addEventListener(evtType, (evt) => {
        aq.resolve(evt);
        aq.enqueue();
    });

    return {
        async* [Symbol.asyncIterator]() {
            while (1) {
                yield await aq.dequeue();
            }
        }
    };
}

export async function* mapTo(ai, projection = (v) => v) {
    for await (const e of ai) {
        yield projection(e);
    }
}

export async function* end(ai, condition = (_v, _i) => true) {
    let cnt = -1;
    for await (const v of ai) {
        if (condition(v, cnt += 1)) {
            break;
        }
        yield v;
    }
}

const noop = () => {
};

//  Observable => producer
//  for await of => consumer

export const waitUntil = async (predicate) => {
    //  todo
    // const aq = new AsyncQueue();
    // aq.enqueue()
    //
    // ;(async () => {
    //     while (await predicate()) {
    //         aq.resolve();
    //     }
    // })().then(noop);
    //
    // await aq.dequeue();
};


//  todo
export class WaitGroup {

    /**
     * @param {number} count
     */
    constructor(count = 0) {
        this.aq = new AsyncQueue();

        this.resolves = [];

        this.add();

        createArrayWith(count).forEach(() => {
            this.add();
        });
    }

    add() {
        this.aq.enqueue();
        this.resolves.push(this.aq.resolve);

    }

    done() {
        this.resolves.shift()();
    }

    async wait() {
        // console.log(this.aq);
        //  再次被调度到的时机,考虑下使用promise的观察者特性,而不是间隔毫秒来检查
        // return waitUntil(() => this.cnt === this.completeCnt);

        console.log("start");
        for  await (const p of this.aq) {
            console.log('await ',p);
        }
        console.log("end");

        // return Promise.all(...this.aq[Symbol.asyncIterator]);
    }
}

const createArrayWith = (len, v) => {
    let arr = Array.from({length: len});
    if (typeof v === "function") {
        return arr.map((_, i) => v(i));
    }
    return arr.fill(v);
};

//  obs.pipe([p1,p2,......]).subscribe()
const pipe = (pipelines) => {

};


class AsyncQueue {
    constructor() {
        /**
         * @type {Promise[]}
         * 在头部可以使用一个promise 卡住,让异步迭代器无法完成
         */
        this.promiseQueue = [];

        this._resolve = null;
    }

    get resolve() {
        return this._resolve;
    }

    enqueue() {
        const {promise, resolve} = Promise.withResolvers();
        this.promiseQueue.push(promise);
        this._resolve = resolve;
    }

    dequeue() {
        return this.promiseQueue.shift();
    }

    async* [Symbol.asyncIterator]() {
        let v;
        while (v = await this.dequeue()) {
            console.log(v);
            yield  v;
        }
    }
}

/**
 * @description multi selection 选择一个最新有值的生产者
 * @param {[]} asyncIterList - 上游生产者列表
 */
export function select(asyncIterList) {
    const aq = new AsyncQueue();

    aq.enqueue();

    //  利用promise特有的观察者性质,这样可以不使用在某个周期性的重复检查
    //  一开始塞入一个堵塞,不让异步迭代器完成退出
    //  之后每当一个上游生产者退出之前检查其他生产者是否完成,如果全部生产者退出,那么让最后一个promise退出
    const isComplete = createArrayWith(asyncIterList.length, false);

    for (let i = 0; i < asyncIterList.length; i += 1) {
        const asyncIter = asyncIterList[i];

        ;(async function () {
            for await (const asyncIterItem of asyncIter) {
                aq.resolve({type: i, item: asyncIterItem, isAllEnd: false});
                aq.enqueue();    //  不需要锁,因为同一时间事件循环只有一个函数会执行这里
            }

            isComplete[i] = true;

            //  每一生产者在完成后才检查一次全部流是否已经完成
            if (isComplete.every(v => v)) {
                aq.resolve({type: null, item: null, isAllEnd: true});
            }
        })().then(noop);
    }

    return {
        async* [Symbol.asyncIterator]() {
            for await (const {type, item, isAllEnd} of aq) {
                if (isAllEnd) {
                    break;
                }

                yield  [type, item];
            }
        }
    };
}






