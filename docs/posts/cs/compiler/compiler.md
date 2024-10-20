---
date: 2024-10-08
category:
  - compiler basic cs 
tag:
  - basic

---
# How to build the simplest compiler 
first of all there are some basic fundamental concepts of interpreter

## 


### The frame of a basic interpreting
we interrupt a language with another language

```
tokens = scan(code_string)

ast = parse(tokens)

opted_ast = ast.optimize()

interpret(opted_ast)
```

> expression     → literal | unary | binary | grouping ;
> 
> literal        → NUMBER | STRING | "true" | "false" | "nil" ;
> 
> grouping       → "(" expression ")" ;
> 
> unary          → ( "-" | "!" ) expression ;
> 
> binary         → expression operator expression ;
> 
> operator       → "==" | "!=" | "<" | "<=" | ">" | ">=" | "+"  | "-"  | "*" | "/" ;

Recursive Descent Parsing
Context-free grammars

### sequential
```
abstract class Stmt{}
abstract class Expr{}

class binary{
    Expr left;
    Expr right;
    Token op;
}

class unary{
    Expr expr;
    Token op;
}

class Assign{
    Token name;
    Expr value;
}

class Grouping{
    Expr expr;
}


```

### control flow
```

class If{
    Expr condition;
    Stmt thenBranch;
    Stmt elseBranch;
}

class While{
    Expr condition;
    Stmt body;
}

class Block{
    List<Stmt> stmts;
}



```

### function supporting
```
class Call{

}

class Return{

}

```

### global variables, environment and enclosure
```
class Env{
    Map<String,Object> values;
    
    define(){
    }
    
    get(){
    }
}

class Interpret{
    Env env;
    
    interpret(List<Stmt> stmts){
    
    }
}


```

### class & inherited
```

```


# The key concept of virtual machine
abstract-machine



The control of the mentality of personal is the paramount important thing of all
Dive into study rather than copy with company, being the master of your fortune

# The key concepts of compiler






