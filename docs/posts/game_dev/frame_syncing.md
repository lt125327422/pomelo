---
date: 2024-10-12
category:
    - game_dev
tag:
    - game
---

### 

其实同步的基本思想非常简单
就是tick由服务端来运行
每一段在每一个tick之间就是收集阶段
收集全部客户端发送过来的msg input
在下一tick的时候把那些tick发送给全部的客户端来做一次分发

但是我们不可能和单机模式一样有16ms的时间 在这里一般都是100ms只有为tick间的间隔
那么客户端一定很卡顿 因为60fps 变味了 10fps左右了
所以不同的操作我们都需要进行不同类型的插值
比如角色移动 我们根据角色当前的位置和服务端发送给我们的目标位置
来进行插值来生成中间帧

forecast
分支预测 这里很像cpu流水线中的处理
同样的我们发送给服务端数据的同时本地也来应用这些input
同时也把本次的输入给记录到一个队列中用于之后把服务器的数据拿回来后 打补丁

我们会在未来某个时间收到来自服务端的返回，这些返回的数据就是服务器把其他玩家的数据和之前我们传输的数据来做的整合
我们需要维护两个state 其中一个是lastState 也就是真实有效的 与服务器同步的
另一个state就是提前运用了本地的inputs


首先我们要做的第一件事情就是把state回滚到上一次的lastState
之后把服务端的同步数据给用回来
之后备份state到lastState
在pendingData中过滤掉那些服务端已经使用过的input
最后在pendingData中剩下的就是服务器还尚未同步的inputs 我们直接使用他们， 相当于打上一次补丁
这种做法其实还是有缺点的 玩家只能保证自己的操作流畅 但看到的队友和敌人还有其他需要网络同步的信息还是会有闪现效果

是否需要对 fid进行排序


浮点数处理的问题
比如客户端传来的deltaTime
方案一 把浮点数转为整数  之后处理  最后重新转会浮点数
方案二 直接截取固定的小数位置 保证不同平台下的一致性
 

二进制编码

加密


压缩

伪随机
