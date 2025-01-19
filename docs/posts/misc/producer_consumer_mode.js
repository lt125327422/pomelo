//  channel

//  pipeline


export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


export async function* createTicker(gap) {
    let c = -1
    while (true) {
        await sleep(gap)
        yield c += 1
    }
}

export async function* fromClick(el) {
    let queue = []

    el.addEventListener('click', evt => {
        queue.push(evt)
    })

    while (1) {
        for (let i = 0; i < queue.length; i += 1) {
            const evt = queue[i];
            queue.splice(i, 1);
            yield evt
        }

        await sleep(0) // replace setTimeout with RAF
    }
}

export async function* mapTo(ai, projection = (v) => v) {
    for await (const e of ai) {
        yield projection(e)
    }
}

export async function* end(ai, condition = (_v, _i) => true) {
    let cnt = -1
    for await (const v of ai) {
        if (condition(v, cnt += 1)) {
            break
        }
        yield v
    }
}

const noop = () => {
}


/**
 * @description multi selection
 * @param {[]} asyncIterList
 * @returns {AsyncGenerator<any, void, *>}
 */
export async function* select(asyncIterList) {
    const queue = []

    const isComplete = Array.from({length: asyncIterList.length}).fill(false)

    for (let i = 0; i < asyncIterList.length; i += 1) {
        const asyncIter = asyncIterList[i];

        ;(async function () {
            for await (const asyncIterItem of asyncIter) {
                queue.push({type: i, item: asyncIterItem})    //  不需要锁,因为同一时间事件循环只有一个函数会执行这里
            }
            isComplete[i] = true;

        })().then(noop);
    }

    while (isComplete.some(v => !v)) {   //  某一个 isComplete 为 false 需要重新遍历等待全部的操作完成
        for (let i = 0; i < queue.length; i += 1) {
            const {type, item} = queue[i];
            queue.splice(i, 1);  //  不需要锁,原因同上
            yield [type, item]  //  需要给出type
        }

        await sleep(16) //  需要让出协程
    }
}



