---
date: 2024-10-07
category:
  - graphics
tag:
  - basic
---

# The comprehension of operator system 
Some time ago, I lay my hand on the topic of operator system, I try some 
way to learn it, for example, reading the book ostep, watching video
6.s081 and some other topic, summering below content to review.

## Preparation for os

[//]: # (- [SYSTEM CALL]&#40;#system-call&#41;  )
- `C` Need less to say
- `risv-v` A reduced instruction set 
- `make` a tool for building your project in imperative approach
- `build-essential` a pack of tools including gcc、g++、make、libc6-dev
- `gdb-multiarch ` debug risc-v, arm or mips on x86-based pc
- `qemu-system-misc`  an emulator
- `gcc-riscv64-linux-gnu ` for risv-v 64 across compiler, Let we to compiler binary file in the format of risv-v on x86-based pc
- `binutils-riscv64-linux-gnu` binary tools package for risv-v x64 including linker, assembler, symbols table tools, object file operate tools (objdump objcopy)

## optional
- `wsl2 for ubuntu`  run ubuntu on Windows os host
- `clion` smart IDE for C

## How does the xv6 system boot?
Config with multi cpu core, if we have more than one core, for every core
they will execute the code in here

> entry → start → main 

```c
main(){
    //  Init os
    
    init_memory()
    init_vm()
    init_disk()
    
}

```

## Trap
There are three types of traps in xv6 os
- system call
- device interrupt
- page fault

```c
    if(r_scause() == 8){
        //  system call
    } else if((which_dev = devintr()) != 0){
        //  device interrupt, say, PLIC which include uart and virtual disk 
        //  and timer interpreter
    } else {
        //  page fault
    }
```

### System Call
We cannot call system call directly, we must transform into the mode to 
kernel mode, most of the things in kernel space rather than user space.
`microkernel` and `monolithic-kernel`
in other words, if we want to get some superpower, we must jump into kernel 
space.

operator system is also a program as any other ones.

> user -> trampoline -> kernel -> trampoline return -> kernel




### page fault
sometimes we visit a wrong address which is not valid from memory.
hardware will give an error to us. we can handle this on kernel space on OS,
for some purpose we can advantage this feature to implement some interesting  
feature, say, cow (copy on writing, lazy page allocation)


### VM & Page Table 
for some reason, we want to run multi program in one computer,
but there is a limited physical memory capacity, we cannot load everything
into RAM from DISK(or SSD), besides everything we see in the user program is a gloss, memory address, physical 
memory  


#### physical memory management
- we need a linked list to management our freed physical memory and allocating
them in the future.

```c
//  PGROUNDUP(2172) => 4096
#define PGROUNDUP(sz)  (((sz)+PGSIZE-1) & ~(PGSIZE-1))
#define PGROUNDDOWN(a) (((a)) & ~(PGSIZE-1))

char pa_start[];
char pa_end[];

struct run{
    struct run * next;
};

struct {
    struct spinlock lock;
    struct run *freelist;
} mem;

//  Get a Page (4kb) from freelist  
void* alloc(){
    
}

void free(void* pa){
    
}

void init(){
    
}
```

- virtual memory management
```c


        

```
### Deice Interrupt
ideally, communication is not necessary to us, but we want to extend our computer
to get more powerful, say, we want to save the running state of our machine
or save the result to a medium so we can use it in the future, or we want to get information
from some other remote pc on the internet.





## Device




page tables

mv -> pm






## Disk

flags 
- `MAP_SHARED` any change to this file mapping will be written back to memory


```c
void *mmap(void *addr, size_t len, int prot, int flags,
           int fd, off_t offset);

mmap(0,8192,PROT_READ | PROT_WRITE,MAP_SHARED，fd,offset)

int munmap(void *addr, size_t len);

we can map a file at multi times
```

flow > detail > practice > note > review > thinking


## Schedule


## Locking
