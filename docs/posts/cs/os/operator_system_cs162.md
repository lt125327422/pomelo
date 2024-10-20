---
date: 2024-10-07
category:
  - os
tag:
  - basic
---



# projects
Pintos




## project_0

### question_1
> What virtual address did the program try to access from userspace that caused it to crash? Why is the program not allowed to access this memory address at this point? (Be specific, mentioning specific macros from the Pintos codebase.)

Referring to the file `do-nothing.output` , we find that
`
Page fault at 0xc0000008: rights violation error reading page in user context.
`

Visit the address at `0xc0000008`, we get an error


### question_2 
> What is the virtual address of the instruction that resulted in the crash?
`
Interrupt 0x0e (#PF Page-Fault Exception) at eip=0x8048915
`

when we run the instruction at 0x8048915, we get a crash

### question_3
> To investigate, disassemble the do-nothing binary using i386-objdump (you used this tool in Homework 0). What is the name of the function the program was in when it crashed? Copy the disassembled code for that function onto Gradescope, and identify the instruction at which the program crashed.

the name of function is `_start` 

```
 8048915:	8b 45 0c             	mov    0xc(%ebp),%eax
```

```
0804890f <_start>:
 804890f:	55                   	push   %ebp
 8048910:	89 e5                	mov    %esp,%ebp
 8048912:	83 ec 18             	sub    $0x18,%esp
 8048915:	8b 45 0c             	mov    0xc(%ebp),%eax
 8048918:	89 44 24 04          	mov    %eax,0x4(%esp)
 804891c:	8b 45 08             	mov    0x8(%ebp),%eax
 804891f:	89 04 24             	mov    %eax,(%esp)
 8048922:	e8 6d f7 ff ff       	call   8048094 <main>
 8048927:	89 04 24             	mov    %eax,(%esp)
 804892a:	e8 d4 22 00 00       	call   804ac03 <exit>
```


### question_4
> Find the C code for the function you identified above (Hint: it was executed in userspace, so it’s either in do-nothing.c or one of the files in proj-pregame/src/lib or proj-pregame/src/lib/user), and copy it onto Gradescope. For each instruction in the disassembled function in #3, explain in a few words why it’s necessary and/or what it’s trying to do. Hint: read about 80x86 calling convention.

 we get caching at `.workspace/code/personal/proj-pregame/src/lib/user/entry.c:6`

```
#include <syscall.h>

int main(int, char*[]);
void _start(int argc, char* argv[]);

void _start(int argc, char* argv[]) { exit(main(argc, argv)); }
```

Allow stack space and put argv into main


### question_5
> Why did the instruction you identified in #3 try to access memory at the virtual address you identified in #1? Please provide a high-level explanation, rather than simply mentioning register values.

because we want to get the params `argv` passed by system


### gdb basis (extra)
```
ctrl + up (foucs on souce code)  i (focus on command input)
stepi   step   step [n]  continue next
backtrace
p /x [variable]


```


### a common skill 
跳转到一个函数内部,之后在函数内部把返回地址改掉(也就是修改当前函数的stack frame)
这样函数的返回时就会自动跳转到我们之前修改的返回地址(stack frame的布局)
这常用于中断处理,比如从内核中返回到用户程序

| return address                |
|-------------------------------|
| stack top (current stack top) |



# appendix
## docker 
docker file mapping volume, change of file sync 
set > resource > wsl integration

Enable integration with my default WSL distro.
Select one of your distros.
