---
title: Flutter
category: 
  - flutter
tags:
  - app_dev
---

## flutter basic

### Dart
AOT(PRODUCTION) or JIT(Debug)
Stream + Future = Future Stream (Async Stream)
a ??= 3 if 'a' is null then a will be assigned to 3
whenCompleted => finally
async => Future
async* => Stream


flutter 打包和运行 环境诊断工具

flutter doctor
flutter analyze --suggestions

flutter config  --jdk-dir  "/path/to/your jdk home"
强制指定jdk版本

flutter 

### Basic widget i flutter
- base `Scaffold` `AppBar` `Container`
- Layout `Flex` `Column` `Row` `Expanded` `Center` `SizedBox`
- Content ``
- Font `Text` ``
- Media `Image` `VideoPlayer` 
- Custom `LayoutBuilder` `CustomPaint`

### List and Sliver

```dart
    return ListView.builder(
            scrollDirection,
            itemCount,
            itemBuilder: (context, index) {
                return Text(index);
            );
        },


    CustomScrollView(
        slivers:[
            SliverAppBar(
                expandedHeight,
                collapsedHeight,
                floating,
            ),
            SliverList(
                delegate: SliverChildBuilderDelegate(
                    (context, index) => Text(index)
                ),
            )
            
        ]
    )
```

### Events and Gestures
```dart
build(){
    return GestureDetector(
        onTap: () {
            setState(() {
            });
        },
        child: Container(
            color: Colors.grey,
        ),
    );
}
```

Other than `onTap` , there are some other gestures we can detect , say , 
`DoubleTap` `LongPress` `Drag` `Pan` `Scale` etc.

### Listener

```dart
 Widget build(BuildContext context) {
    return Listener(
      child: Container(),
      onPointerDown: (PointerDownEvent event) {},
      onPointerMove: (PointerMoveEvent event) {},
      onPointerUp: (PointerUpEvent event) {},
    );
  }
```



## Animation

###  declaration of animation

```dart
build(){
    return AnimationContainer(
        width:100,
        height:100,
        duration:Duration(secondes:1),
        color:Colors.orange,
    )
}
```
Not only the color property we can animate , but width and height and other properties
can also be animated

### imperative of animation

```dart

late AnimationController controller;

void initState(){
    super.initState();
    controller = AnimationController(
        duration: const Duration(seconds: 3),
        vsync: this,
    );
}

animation = Tween<double>(begin: 0, end: 200).animate(controller);

```

### Data management
- Generating Model Class From Json
- Network
- Provider
- Persistence
- 

## Assets

### Using local assets
```
flutter:
    assets:
      - assets/images/*.png
```


### Dio

```dart
Dio dio = Dio();
Response response = await dio.get("/url?param1=a&param2=b");


await dio.post("/test",data:{filed1:"a",field2:"b"});


```

sql_lite

firebase
- Using device's camera to recognize text from an image
- Reading barcode 




