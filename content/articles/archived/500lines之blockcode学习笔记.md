Date: 20201130
Slug: 500lines-blockcode-learning



[TOC]

## 前言

blockcode是一个html5网页项目，其演示地址在这里： [Block Code (dethe.github.io)](https://dethe.github.io/500lines/blockcode/) 。项目代码在这里：[dethe/bloc](https://github.com/dethe/bloc) 。代码和文章略有不同，主要是拖动方面进一步根据dragula项目简化了代码，其他大体是一样的。

这个小项目主要演示了一种拖动可视化编程，下面主要是从html5编程的角度来学习这个项目，同时进行一些思考。

首先是基本的HTML页面，这个就不用多说了，下面主要分析那些js模块。这些js模块中看到：

```
(function () {})()
```

这种写法的都要优先分析，这些匿名函数在js加载之后会马上执行。其中util.js提供了一些便捷的函数供其他js文件调用，优先分析。

## util.js

这个js文件给window上挂了几个函数作为全局变量，供其他js文件使用。



### elem函数

看到这样的调用：

```
elem("input", { type: "number", value: value })
elem(
      "div",
      { class: "block", draggable: true, "data-name": name },
      [name]
    );
```

这是一个创建HTML DOM元素的便捷函数。第三个参数用于插入一个文本节点或者其他子节点。

### trigger函数

```javascript
  global.trigger = function trigger(name, target) {
    target.dispatchEvent(
      new CustomEvent(name, { bubbles: true, cancelable: false })
    );
  };
```

这个函数新建一个事件，并将这个事件绑定到target元素上，然后触发target的这个事件。下面继续分析整个项目的事件相关内容。

## 事件分析

blocks.js文件里面有：

```
  window.addEventListener("unload", file.saveLocal);
  window.addEventListener("load", file.restoreLocal);
```

window load事件之后将会调用 `file.restoreLocal` ，全局变量file来自file.js，其内的restoreLocal函数等下再细分析。

window unload 事件将会调用 `file.saveLocal` ，其内的saveLocal函数等下再细分析。

全局变量Block.run对应里面的runBlocks函数，其将触发传过来的各个block元素的run事件。

```
trigger("run", block);
```

在menu.js文件里面有：

```
  script.addEventListener("run", runEach);
```

script是：

```
  var script = document.querySelector(".script");
```

也就是中间的div元素。现在block触发run事件之后将会冒泡到script那里，然后script触发run事件之后将会调用这里的runEach函数。runEach函数做了一些什么事情后面再细讲。

在drag.js那里有：

```
drake.on("drop", () => trigger("scriptChanged", document.body));
drake.on("remove", () => trigger("scriptChanged", document.body));
```

这个drake元素和dragula这个第三方js模块有关，其用于处理窗体的拖动事件的。这里是将drop和remove事件都触发了scriptChanged事件。

在menu.js那里有：

```
  document.addEventListener("scriptChanged", runSoon);
```

所有最后将执行这里的runSoon函数，具体细节后面再将。

在file.js那里有：

```javascript
  document
    .querySelector(".clear-action")
    .addEventListener("click", clearScript);
  document
    .querySelector(".save-action")
    .addEventListener("click", saveFile);
  document
    .querySelector(".load-action")
    .addEventListener("click", loadFile);
  document
    .querySelector(".choose-example")
    .addEventListener("change", loadExample);
```

这个很简单，基本的按钮事件和下选菜单事件触发这里的几个函数，具体动作内容后面再细分析。

在menu.js那里除了前面谈到的还有：

```
  script.addEventListener("change", runSoon);
  script.addEventListener("keyup", runSoon);
```

keyup在中间那个脚本区块那里鼠标松开之后触发，change事件应该是脚本区块里面的input里面的值发生了变动然后冒泡出来的事件。这些都将执行runSoon函数，具体什么动作后面再细分析。

在menu.js的run函数那里有：

```javascript
  function run() {
    if (scriptDirty) {
      scriptDirty = false;
      trigger("beforeRun", script);
      var blocks = Array.from(document.querySelectorAll(".script > .block"));
      Block.run(blocks);
      trigger("afterRun", script);
    } else {
      trigger("everyFrame", script);
    }
    requestAnimationFrame(run);
  }
```

其将触发beforeRun和afterRun事件，那个everyFrame事件暂时项目里面还没有对应的动作，应该是没影响了。

在turtle.js那里有：

```javascript
  script.addEventListener("beforeRun", clear); 
  script.addEventListener("afterRun", drawTurtle); 
```

上面提到的beforeRun和afterRun的调用函数是这里的clear和drawTurtle函数。

此外turtle.js还有一句：

```
  window.addEventListener("resize", onResize);
```

这个是额外的尺寸调整处理了。

有了上面的基本分析，那么接下来分析window的load事件绑定的restoreLocal函数就是第一要务了，这很合情理，先看看浏览器刚加载网页做了一些什么事情。

## 刚加载时动作分析

```javascript
  function restoreLocal() {
    jsonToScript(localStorage[title] || "[]");
  }
  
  function jsonToScript(json) {
    clearScript();
    JSON.parse(json).forEach(function (block) {
      scriptElem.appendChild(Block.create.apply(null, block));
    });
    Menu.runSoon();
  }

  function clearScript() {
    Array.from(document.querySelectorAll(".script > .block")).forEach(function (
      block
    ) {
      block.parentElement.removeChild(block);
    });
    Menu.runSoon();
  }
```

clearScript移除了script下的所有子节点。然后执行 Menu.runSoon() 。runSoon函数仅仅设置了一个变量：

```
  function runSoon() {
    scriptDirty = true;
  }
```

将localStorage里面保存的json值读取出来之后下面开始根据这个json值来重载各个div block元素。这其中的关键语句是：

```
Block.create.apply(null, block)
```

Block.create实际是createBlock函数：

```javascript
function createBlock(name, value, contents) {
    var item = elem(
      "div",
      { class: "block", draggable: true, "data-name": name },
      [name]
    );
    if (value !== undefined && value !== null) {
      item.appendChild(elem("input", { type: "number", value: value }));
    }
    if (Array.isArray(contents)) {
      item.appendChild(
        elem(
          "div",
          { class: "container" },
          contents.map(function (block) {
            return createBlock.apply(null, block);
          })
        )
      );
    } else if (typeof contents === "string") {
      // Add units specifier
      item.appendChild(document.createTextNode(" " + contents));
    }
    return item;
  }
```

具体上面就是创建各个Block的过程，并不是太难懂。所以加载时的动作就是将原script里面的各个block重载进去，但我经过测试发现实际上run函数还是执行了，然后发现这个run函数是一直不停的在执行：

```javascript
  function run() {
    if (scriptDirty) {
      scriptDirty = false;
      trigger("beforeRun", script);
      var blocks = Array.from(document.querySelectorAll(".script > .block"));
      Block.run(blocks);
      trigger("afterRun", script);
    } else {
      trigger("everyFrame", script);
    }
    requestAnimationFrame(run);
  }

  requestAnimationFrame(run);
```

如下这种写法：

```
function repeatOften() {
  // Do whatever
  requestAnimationFrame(repeatOften);
}
requestAnimationFrame(repeatOften);
```

目标函数将会在浏览器每次重新渲染前执行一次。

所以runSoon虽然只改了一个变量，但这个变量将会导致上面那个区块的代码被执行。

首先触发了beforeRun事件，然后运行了 `Block.run(blocks)` ，然后触发了afterRun事件。

```
  function runBlocks(blocks) {
    blocks.forEach(function (block) {
      trigger("run", block);
    });
  }
```

这将继续触发各个block的run事件。继而再触发runEach函数：

```javascript
  function runEach(evt) {
    var elem = evt.target;
    if (!elem.matches(".script .block")) return;
    if (elem.dataset.name === "Define block") return;

    elem.classList.add("running");
    scriptRegistry[elem.dataset.name](elem);

    elem.classList.remove("running");
  }
```

beforeRun和afterRun只是绘图的一些额外动作，最关键的是runBlocks这里。然后最关键的是这一句：

```
scriptRegistry[elem.dataset.name](elem);
```

这就是调用实际函数的那一句。而这些函数都是在turtle.js那里定义的：

```
  function menuItem(name, fn, value, units) {
    var item = Block.create(name, value, units);
    scriptRegistry[name] = fn;
    menu.appendChild(item);
    return item;
  }
  
    Menu.item("Forward", forward, 10, "steps");
```

这个一方面是在绘制左边的菜单，另一方面将函数注册到了 scriptRegistry那里。最后turtle.js具体和canvas相关的绘图细节这里就忽略讨论了。

##  repeat语句支持

```
  function repeat(block) {
    var count = Block.value(block);
    var children = Block.contents(block);
    for (var i = 0; i < count; i++) {
      Block.run(children);
    }
  }
  menuItem("Repeat", repeat, 10, []);
```

具体是假设顺序的话则依次触发各个block的run事件，如果遇到repeat区块，则依次触发各个子区块的run事件。

我担心repeat区块里面再夹个repeat区块有问题，经过试探发现确实解析上是有问题的。如下图所示这个例子：

![img]({static}/images/2020/blockcode_image_1.png)

他解析的顺序是：

```
f 50    f50

r 2    l50 f30

f50  f50

r2  l50 f30

f50 f50

r2  l50 f30
```

但是按照程序语法应该是 f50 l50 f30 l50 l30 f50  l50 f30 l50 l30 f50  l50 f30 l50 l30 。



