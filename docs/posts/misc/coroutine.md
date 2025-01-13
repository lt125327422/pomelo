很多情况下我们都会写出这样的代码比如处理js动画等等, 当然这是现实情况的简化,里面可能有很多业务逻辑

```js
setTimeout(() => {
    console.log("task 0")

    setTimeout(() => {
        console.log("task 1")
    }, 2000)

}, 1000)
```

上面代码一旦业务复杂后非常难以理解，我们可以把他转为 promise ，这样给我们一种假象，我们以一种看上去好像在编写同步顺序执行逻辑的方式来编写异步代码

```js
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

;(async () => {
    await sleep(1000)

    console.log("task 0")

    await sleep(2000)

    console.log("task 1")
})()
```

还有另一个场景，比如我们声明了一些全局变量，之后有一个地方异步的获取数据或者其他不确定的操作，之后设置这个全局变量，
在另一个地方我们需要用这个设置好的对象，这里用sleep就不合适了，因为我们不确定具体的时间，要是短了就会空指针，
只能设置一个超时时间，这里我们需要一个判断条件，这里就是另外一个方法了waitUntil。

```js
 const waitUntil = async (predicate) => {
    while (1) {
        if (predicate()) {
            break
        }

        await CoroutineManager.WaitForEndOfFrame()
    }
}

//  globalData.js
export let data = null

export const setData = (_data) => {
    data = _data
}

export const getData = (_data) => {
    return waitUntil(() => !!data)
}

//  async.js
import {setData} from 'globalData.js'

(async () => {
    const [data1, data2] = await Promise.all([
        getExternalData(),
        getExternalData2()
    ])
    setData([data1, data2])
})()


//  read.js
import {data} from 'globalData.js'

const doBusiness = async () => {
    const globalData = await getData()

    //  task >>>>>>>>>>>>
}

```

> 上面的代码就保证了绝对的安全获取全局的异步数据，其实这和vue正好相反，我们这里用的是拉取，而vue是推送，
> 在每一个帧渲染完成之后我们检查数据的获取情况，而且我们还可以切换检查的策略，比如用宏任务而不是微任务，
> 并且加入间隔时间等


上面都是准备工作，接下来就正式开始协程了，我在一开始以为js的生成器就是协程，后来看其他语言，比如go，里面就没有生成器，但是却有协程
可以说协程是一个抽象的概念，但是实现的方式有很多，比如 生成器 (generator) 是实现 coroutine 行为的一种方式
其实协程的实现方式有很多，这里就不细说了
生成器可以被看为是一个状态机，给一个输入，他会给我们一个输出，并且内部的状态也会改变

```js
function* gen() {
    const userInput1 = yield "output1"
    console.log(userInput1)
    const userInput2 = yield "output2"
    console.log(userInput2)
}
```

> 上面 yield 右边的是状态机的输出,而左边是用户的输入
> 有了协程，我们可以做一些在原来无法做到的事情 让函数暂停执行，稍后再来恢复
> 这样就可以在多个协程间切换


举一个实际的例子，有一个场景，根据用户的下拉选择，之后立马搜索poi list数据在地图上展示
这些poi通过交错动画一个个出现在屏幕上的比如第一个0ms出现 第二个 100ms 第二个 200ms 依此类推
但是用户可能重新选择了条件，是个时候拿到新数据，但是旧的函数还在执行，我们强行插入就会得到错误的poi展示在地图上

这种时候平时用的最多个就是全局变量loading ， 如果正在loading，直接让新的执行返回，但这样用户体验非常差，可能要等2s全部poi
出现后才能解开条件筛选的使用。还有防抖其实也一样体验也没有好多少，比如那个延迟时间到底设置多少合适，200ms可能不够，500ms的话太长了
而且他也不知道什么时候才能结束，如果函数已经开始执行，防抖会得到错误的结果，最后就是节流，和防抖一样无法正常工作

> 我们需要一种机制能够把函数的执行给revoke掉，这是最直观的解决思路

```js

;(() => {
    const coroutineManager = new CoroutineManager();

    let renderPoiCo = CoroutineManager.createNoopCoroutine()

    async function* renderPoi() {
        try {
            console.log("Clear Poi on Map")

            for (const i in Array.from({length: 20})) {
                console.log("Render poi effect")

                //  Wait for animation complete      这里模拟了异步的执行渲染过程
                yield await sleep(100 * Number(i))
            }
        } finally {
            console.log("Clear poi list in this turn") //  清理这一轮渲染的poi,副作用清除
        }
    }


    const onHandleUserSelect = () => {
        coroutineManager.stopCoroutine();   //  停止之前的执行,并且在finally中执行清理副作用函数


        coroutineManager.startCoroutine(
            renderPoiCo = renderPoi()   //  创建本轮的协程并保留引用
        );   //  开始执行任务
    }

})()

```

> 这样代码就容易读很多,而且容易维护,如果不用这个方法的话会声明很多的全局变量之后各种判断,业务逻辑和功能代码
> 耦合会非常严重,后期如果换人的话难以维护


下面是依赖库的具体实现
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

```

还没有完,可不可以做一些其他有趣的事情,比如3秒内完成图片中的5个物体的点击,如果没有在3秒内完成,重新复位点击,否者即完成这个任务
我们可以组合上面的那些工具方法来完成一些任务
```ts
let clickCount = 0
const sec = 3

onMounted(async () => {
    await checkIsDoneTaskInTime(condition, reset, sec)
    console.log("on complete task")
})


function condition() {
    //  这里是简化版本的
    return clickCount === 5;
}

function reset() {
    clickCount = 0
    //  一些清理工作 
}

const onHandleUserClick = () => {
    clickCount += 1
    // 一些副作用 比如更新视图
}


//  通用的功能代码块
const checkIsDoneTaskInTime = async (isReached: () => boolean, onResetValue: () => void, sec: number) => {
    const isFinishInTime = async () => {
        return Promise.race([
            CoroutineManager.WaitUntil(isReached),
            CoroutineManager.WaitForMillSeconds(sec * 1e3).then(() => {
                onResetValue()
                throw new Error("timeout in this turn")
            })
        ])
    }

    while (1) {
        try {
            await isFinishInTime();
            break
        } catch (e) {
            if (e.message !== "timeout in this turn"){
                throw e //  Thrown by user 
            }
        }
    }
}

上面可以看到很容易把业务代码和功能代码隔离开,这样也好测试和维护

```
