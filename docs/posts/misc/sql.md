
试了一下把sql翻译为了js的数据流操作,就能理解为什么有些sql是合法的,有些为什么效率低
下面是一些实现.可能有些实现很低效,这是为了理解方便的原因

> table inventory_item

| id | name            | type      | price |
|----|-----------------|-----------|-------|
| 1  | red potion      | consume   | 60    |
| 2  | sliver sword    | tool      | 2000  |
| 3  | copper fish rod | tool      | 1000  |
| 4  | iron boot       | equipment | 200   |
| 5  | pomelo          | other     | 20    |
| 6  | crystal ball    | other     | 600   |

```js
const table = [
    {id: 1, name: 'red potion', type: 'consume', price: 60},
    {id: 2, name: 'sliver sword', type: 'tool', price: 2000},
    {id: 3, name: 'copper fish rod', type: 'tool', price: 1000},
    {id: 4, name: 'iron boot', type: 'equipment', price: 200},
    {id: 5, name: 'pomelo', type: 'other', price: 20},
    {id: 6, name: 'crystal ball', type: 'other', price: 600},
]


// select * from inventory_item
const res = table


// select count(1) from inventory_item
const res = table.length


// select name from inventory_item
const res = table.map(({name}) => name)


// select name from inventory_item where price >= 200
const res = table.filter(({price}) => price > 200).map(({name}) => name)

/*
    SELECT name, type
    FROM inventory_item
    UNION ALL
    SELECT name, type
    FROM inventory_item2;
*/

const res = table.conact(table2)

/*
    select type,avg(price) as price_avg,count(1) as type_count 
    max(price) as max_pice,min(price) as min_price
    from inventory_item 
    group by type
*/
Object.entries(table.reduce((acc, cur) => {
    if (!Reflect.has(acc, cur.type)) {
        Reflect.set(acc, cur.type, [])
    }

    Reflect.get(acc, cur.type).push(cur)

    return acc
}, {})).map(([gName, gItems]) => ({
    type: gName,
    price_avg: gItems.reduce((a, c) => a + c.price, 0) / gItems.length,
    type_count: gItems.length,
    max_pice: Math.max(...gItems.map(({price}) => price)),
    min_price: Math.min(...gItems.map(({price}) => price)),
}))

// 简化一下上面的代码
Object.entries(groupBy(table, ({type}) => type))
    .map(([gName, gItems]) => ({
        type: gName,
        price_avg: gItems.reduce((a, c) => a + c.price, 0) / gItems.length,
        type_count: gItems.length,
        max_price: Math.max(...gItems.map(({price}) => price)),
        min_price: Math.min(...gItems.map(({price}) => price)),
    }))

function groupBy(table, getGroupName) {
    return table.reduce((acc, cur, i) => {
        const gName = getGroupName(cur, i)

        if (!Reflect.has(acc, gName)) {
            Reflect.set(acc, gName, [])
        }

        Reflect.get(acc, gName).push(cur)

        return acc
    }, {})
}


//  from 子查询
/*
select concat(type,_,type_of_prod_cnt) as bind_type_count from 
(
    select type ,count(1) as type_of_prod_cnt from inventory_item 
    group by type
) as ii
*/
Object.entries(groupBy(table, ii => ii.type)).map(([gName, g]) => {
    return {
        type: gName,
        type_of_prod_cnt: g.length,
    }
}).map(({type, type_of_prod_cnt}) => {
    return {
        bind_type_count: `${type}_${type_of_prod_cnt}`
    }
})

//  select 子查询
/*
select *,(select avg(price) from inventory_item) as avg_price 
from inventory_item
*/
table.map(row => {
    return Object.assign({}, row, avgBy(table, (item) => item.price))
})

function avgBy(table, evaluateV) {
    return summaryBy(table, evaluateV) / table.length
}

function summaryBy(table, getItemV) {
    return table.reduce((a, c, i) => a + getItemV(c, i), 0) / table.length
}

//  where 子查询
/*
select * from inventory_item
 where price >= (select avg(price) from inventory_item)
*/

table.filter((item) => {
    return item.price >= avgBy(table, (item) => item.price)
})


//  关联子查询
/*
select * from inventory_item as iio
where price >= 
(
    select avg(price) as avg_price
    from inventory_item iii 
    where iio.type = iii.type 
    group by type
)
*/

table.filter(iio => {
    return iio.price >=
        avgBy(Object.values(groupBy(table.filter((iii) => iii.type === iio.type), ({type}) => type))[0])
})


// inner join 必须两边都不能为空才有效

const sale_history = [
    {id: 1, item_id: 2, sale_time: '2077-06-07', buyer: "spider man"},
    {id: 2, item_id: 3, sale_time: '2077-02-05', buyer: "hero"},
    {id: 3, item_id: 3, sale_time: '2075-01-02', buyer: "bat man"},
]

/*
select ii.name as name, sh.buyer as buyer,sh.sale_time as sale_time
from  inventory_item as ii
inner join sale_history as sh on ii.id = sh.item_id
*/
// table.filter((ii)=>{
//     ii.id === sh.item_id
// })

table.flatMap((ii) => {
    return sale_history
        .filter((sh) => ii.id === sh.item_id)
        .map(sh => ({
            name: ii.name,
            buyer: sh.buyer,
            sale_time: sh.sale_time,
        }))
})


//  left join   左边表为基准,返回左边表的全部数据,右边字段填充为空
table.flatMap((ii) => {
    return sale_history
        .filter((sh) => ii.id === sh.item_id)
        .map(sh => ({
            name: ii.name,
            buyer: sh.buyer,
            sale_time: sh.sale_time,
        }))
}).concat(
    (() => {
        const ids = Object.keys(groupBy(sale_history, (sh) => sh.item_id)).map(Number)
        return table.filter(ii => !ids.includes(ii.id)).map(ii => ({
            name: ii.name,
            buyer: null,
            sale_time: null,
        }))
    })()
)

//  right join  同上,方向相反

//  full outer join 

//  分页
/*
select * from inventory_item 
limit 20,10

limit start,offset
*/

table.slice(20, 20 + 10)

// table.slice(start,start + offset)
```

> 一对多 比如物品表和销售物品销售记录表,每一个销售记录绝对不可能被多个用户共享,所以一个物品对应了多个该物品的销售记录
> 这里就出现了多张表相关的情况  一个物品记录中有一个买家id,卖家id,物品id 和一些销售记录自己的信息


> 多对多, 需要使用中间表,防止数据重复并且这样可以优化查询效率,其实放在一张表也是可以的
> 比如游戏中有物品和角色,一个角色可以有多个物品,但是每一个物品同时也可以有多个角色,
> 加入a和b角色有sword这个物品,sword应该被a和b同时拥有,因为角色a和角色b的sword就是同一个(假设物品没有随机属性)
> 在前端中可能更加喜欢json的方式 no sql db 可能就是这样来定义的了
> 武器表[{itemName:"sword",itemId:1},{itemName:"shield",itemId:2}]
> 角色表[{roleName:"bat man",ownItems:[1,2]},{roleName:"spider man",ownItems:[2]}]
> 


接下来就是事务了,其实可以这么理解,每一个表就是一个全局变量,多线程编程中,如果是全局变量
就要特别的小心,因为我们执行的指令比如 a = a + 1  这个操作需要从内存中先读取a之后+1再写回到内存
汇编代码如下
1 lw   x5 , 4(x6)  // 假设全局变量a在内存地址 x6 + 4 的位置,把a从内存读取到寄存器x5
2 addi x5 , x5, 1   //  把a的值+1并存放到x5中
3 sw   x5 , 4(x6)     //  把a从寄存器写回到内存中

这样确实没什么问题,但是问题是我们有多个核心,每一个核心都有自己的寄存器

假设核心二也在操作这个全局变量  a = a + 3
4 lw   x5 , 4(x6)  // 假设全局变量a在内存地址 x6 + 4 的位置,把a从内存读取到寄存器x5
5 addi x5 , x5, 3   //  把a的值+3并存放到x5中
6 sw   x5 , 4(x6)     //  把a从寄存器写回到内存中

因为cpu多个核心现在是并行执行的,所以真正的执行顺序可能有多种
例如  1 -> 2 -> 3 -> 4 -> 5 -> 6
但是这是运气好的时候

也可能会有这种情况发生
例如  1 -> 2 -> 4 -> 5 -> 3 -> 6
这就不对了,期望是4,但是实际是3
我们想要的是a = a + n 这个操作是一个原子操作,但是芯片中并不是这样的,所以我们如果能在1,2,3外面加一个锁,
也就是只能有一个核心进来修改数据 ,这样就可以把三个指令变为原子操作了


但是锁也不是万能的,还有死锁的问题
比如说我们需要让多个变量的操作为一个原子操作
伪代码
```js



const lockA = new Mutex()
const lockB = new Mutex()

let a = 0
let b = 2

async function x() {
    lockA.acquire()
    await sleep(1)  //  do some task
    lockB.acquire()

    a = a + b
    b = a + 3

    lockB.release()
    lockA.release()
}

async function y() {
    lockB.acquire()
    lockA.acquire()
    
    a = a + b
    b = a + 3

    lockA.release()
    lockB.release()
}


class Mutex {
    constructor() {
        this.locked = false;
    }

    acquire() {
        return new Promise((resolve) => {
            const tryAcquire = () => {
                if (!this.locked) {
                    this.locked = true;
                    resolve();
                } else {
                    setTimeout(tryAcquire, 1); // 等待锁释放
                }
            };
            tryAcquire();
        });
    }

    release() {
        this.locked = false;
    }
}



```

数据库看为是一个全局变量的集合




因为需要上锁