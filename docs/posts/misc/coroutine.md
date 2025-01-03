---
date: 2024-10-9
category:
    - misc
tag:
    - misc
---

###
generator 是实现 coroutine 行为的一种方式
co 可以让我们在多个执行点之间切换

```js

  /**
     * @param ms {number}
     * @returns {Promise<void>}
     */
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

    const raf = () => new Promise(resolve => requestAnimationFrame(resolve));

    class CoroutineManager {

        constructor() {
            /**
             * @type {Set<AsyncGenerator | Generator>}
             */
            this.coPool = new Set()
        }

        /**
         * @param co {AsyncGenerator | Generator}
         * @returns {Promise<void>}
         */
        async startCoroutine(co) {

            if (this.coPool.has(co)) {
                console.warn('co has been started')
            }

            this.coPool.add(co)

            /**
             * @type { IteratorYieldResult | null}
             */
            let res = null;

            while (res = await co.next(res?.value ?? null)) {
                const {done} = res;

                if (done) {
                    break
                }
            }
        }

        /**
         * @description 如果返回done => true 那么说明co已经执行完成，未能成功取消
         * @param co {AsyncGenerator | Generator}
         * @returns {Promise<IteratorYieldResult>}
         */
        stopCoroutine(co) {
            return co.return(null)
        }

        async stopAllCoroutines() {
            return Promise.allSettled([...this.coPool].map(co => this.stopCoroutine(co)))
        }

        static WaitForMillSeconds = sleep

        static WaitForEndOfFrame = raf

        static WaitUntil = async (predicate) => {
            while (1) {
                if (predicate()) {
                    break
                }

                await CoroutineManager.WaitForEndOfFrame()
            }
        }

    }




    //  for test only
    ;(()=>{
        let coroutineManager = new CoroutineManager();

        const getDataMock = async () => {
            await sleep(500);

            return {
                data: {
                    itemName: "hop",
                    description: "A hop tool"
                }
            }
        }

        async function* request() {
            const res = yield getDataMock();   // 被 yield 标记上的意思是在这里可以被暂停

            console.log(res)
        }

        console.log(">>>>>>>>>>")

        let requestCo = request();

        coroutineManager.startCoroutine(requestCo);

        setTimeout(async() => {
            console.log("cancellation")
            console.log(await coroutineManager.stopCoroutine(requestCo));
        }, 1000)
    })()


```