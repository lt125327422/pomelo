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
- risv-v
- qemu
- make
- 



How does the xv6 system boot?
    
Config with multi cpu core, if we have more than one core, for every core
they will execute the code in here

> entry → start → main 

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

### Deice Interrupt

### Page Fault



## Virtual Memory
for some reason, we want to run multi program in one computer, 
but there is a limited physical memory capacity, we cannot load everything  
into RAM from DISK(or SSD), besides 

### page fault 
Sometimes, we visit a wrong address which is not valid from memory. 
Hardware will give an error to us. we can handle this on kernel space on OS,
for some purpose we can advantage this feature to implement some interesting  
feature, say, cow (copy on writing, lazy page allocation) 


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
