

```go
naturals := make(chan int)
squares := make(chan int)

go func counter(){
    for x := 0;;x++{
        naturals <- x
    }
}

go func square(){
    for {
       x := <- naturals
       squares <- x*x
    }
}

for{
    fmt.Println(<-squares)
}

chan <- data
chan <- data
chan <- data

func race(){
    res := make(chan string,3)

    return <- res
}


```