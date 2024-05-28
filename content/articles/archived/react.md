Slug: react
Date: 20220406
Modified: 20231027


[TOC]

## react的纯前端视角
学习react一开始就接触那些工具甚至是一些高级react插件，很是让初学者困惑而生出畏惧之心。建议初学者先跟着下面这个例子简单对react框架在做什么事有个简单的概念，然后再去接触webpack等那些工具链，因为读者作为实际开发人员最终还是会跟着大家那样去实践，编写nodejs后端的react代码，然后通过webpack，babel转成前端渲染代码，会发现这样还是更方便一些的。

下面是react最简单的hello world例子，react在这里之于我们就是一个前端框架，通过react这个前端框架，将会操纵生成一些html代码，主要是 `id=reactDOM` 那里。具体执行脚本在main.js那里。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Add React in One Minute</title>
  </head>
  <body>
    <!-- We will put our React component inside this div. -->
    <div id="reactDOM"></div>

    <!-- Load React. -->
    <!-- Note: when deploying, replace "development.js" with "production.min.js". -->
    <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>

    <!-- Load our React component. -->
    <script src="main.js"></script>
  </body>
</html>
```

main.js文件里面的内容是：
```javascript
let h1 = React.createElement('h1', null, 'hello world')

ReactDOM.render(
    h1,
    document.getElementById('reactDOM')
)
```

从上面这个例子我们看到，React通过 `React.createElement` 和 `ReactDOM.render` 这两个函数，最终将 `document.getElementById('reactDOM')` 这个html目标标签，渲染成了你想要的样子。

其中 `React.createElement` 创建一个UI元素，然后 `ReactDOM.render` 是将这个UI元素在目标位置渲染出来。

但是写上一堆createElement来创造UI元素实在不是一个好方法，于是React创造了JSX这个概念。

利用JSX，helloworld样例代码可以简单写为：

```
let h1 = <h1>hello world</h1>

ReactDOM.render(
    h1,
    document.getElementById('reactDOM')
)
```

不过读者直接运行肯定还是报错的，因为h1的那个写法都不是有效的javascript写法了，你的index.html文件还需要进行如下配置修改：

```
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

    <!-- Load our React component. -->
    <script type="text/babel" src="main.js"></script>
```
babel的作用就是将jsx语法代码转译成为JavaScript代码。上面只是演示代码，一般生产实践会利用babel的命令行功能来实现这种转换。


## JSX
虽然JSX看上去会和类似jinja2这样的模板引擎有点类似，比如下面的代码：
```jsx
const name = 'react';
const element = <h1>hello, {name}</h1>;
```

花括号里面可以是任何有效的JavaScript表达式。但JSX更应该看作JavaScript代码而不是某种类HTML的东西。比如<h1>...</h1>这样的语句实际上会解析成为JavaScript代码：`React.createElement('h1'...)` 。

关于JSX代码的第二个知识是对于跨多行的代码要用圆括号包装：


```
let content = (
    <div>
        <h1>hello world</h1>

        <ul>
            <li>apple</li>
            <li>banana</li>
        </ul>
    </div>
    
)
ReactDOM.render(
    content,
    document.getElementById('reactDOM')
)
```

对于HTML各个标签的属性，比如a标签的href属性，JSX上类似HTML那边正常写即可：

```
let a = <a href="..."></a>
```
传递过去的属性，应该是规范的属性，如果不是则会忽略，有几个特例。

1. class应该写为className
2. 自定义属性要以 `data-` 开头。
3. 布尔类型属性比如 `disabled required checked` 等必须设置为JavaScript表达式而不能是字符串，比如 `<input required={false} />` 如果设置为字符串会一律解释为布尔真值。
4. style属性必须传递的是JavaScript对象，比如： `<input style={{fontSize: '30pt'}} />` css的属性名采用小驼峰规则，比如font-size为fontSize，比如font-family为fontFamily。


## 组件
JSX遇到小写字母开头的标签会认为是html原生标签，用 `React.createElement` 来处理，而遇到大写字母开头的则认为是React组件。React组件有两种写法：函数组件和class组件。

读者出于省心考虑的话就学习一个函数组件即可，我看react官方文档也就是用的函数组件。后面有需要再去了解学习下class组件怎么写的。

如果某个函数接受props参数并返回React元素，则其就是一个函数组件。

```
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```


上面的Welcome是一个React组件，其可以直接写入到JSX里面。

```jsx
const element = <Welcome name="Sara" />;
```


## state和props
这个例子介绍了react很多核心概念，同时又不是特别复杂，作为继hello world例子之后的第二个教学例子是很合适的。

```jsx
class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() }
    }
    componentDidMount() {
        this.timerId = setInterval(() => this.tick(), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    tick() {
        this.setState({
            date: new Date()
        })
    }
    render() {
        return (
            <div>
                It is {this.state.date.toLocaleTimeString()}.
            </div>
        )
    }
}

let content = (
    <div>
        <h1>hello world</h1>

        <Clock />
    </div>

)

ReactDOM.render(
    content,
    document.getElementById('reactDOM')
)
```

上面例子 `componentDidMount` 是组件渲染到DOM中之后会运行。 `componentWillUnmount` 是组件生命周期最后执行的方法。


类组件里面的props是不可变的，state是可变的。具体一个表示组件的属性，一个表示组件的状态。改变组件的状态要通过 `setState` 方法来进行，只有通过这个方法React才知道组件的状态发生了改变，这样其会重新调用render方法来重新渲染。

出于性能的考虑，React会将多个 `setState` 语句合并，然后再更新DOM。

React的数据是向下流动的，意思是父组件的props和state可以影响子组件，但是子组件的state变动不会影响父组件的。


## 参考资料

1. react官方教程和资料
3. [getting-started-with-react](https://www.taniarascia.com/getting-started-with-react/)
4. 快速上手React编程, [美]阿扎·马尔丹



