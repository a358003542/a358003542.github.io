Slug: electron-learning-notes
Date: 20201018
Tags: gui, javascript, electron

[TOC]

## 前言

electron是一个npm包，nodejs移除了Webkit之类的网页渲染功能，现在electron加上去了，所以可以把electron看作一个精简版的chromium浏览器。而electron可以让你使用html5的风格来灵活编写GUI，并实现跨多个平台的桌面端应用。

nodejs相关的知识这里就不赘述了，你可以运行 `npm init`  来创建一个你的项目的 `package.json`  文件。

然后运行：

```
$ npm install --save-dev electron
```

来将electron安装到你的项目开发环境中。

然后如下设置：

```json
{
  "scripts": {
    "start": "electron ."
  }
}
```

好让你输入 `npm start`  时执行 `electron .` 命令。现在运行 `npm start` 还不行，因为你的项目最基本的骨架还没搭建好。

## 入门例子
下面例子来自官方的快速入门教程，我这里先将代码粘贴进来，然后后面再慢慢讲解。

main.js

```js
// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow () {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 加载 index.html
  mainWindow.loadFile('index.html')

  // 打开开发工具
  // mainWindow.webContents.openDevTools()
}

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
// 也可以拆分成几个文件，然后用 require 导入。
```

preload.js
```js
// 所有Node.js API都可以在预加载过程中使用。
// 它拥有与Chrome扩展一样的沙盒。
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})
```

index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <!-- https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP -->
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <meta http-equiv="X-Content-Security-Policy" content="default-src 'self'; script-src 'self'">
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using Node.js <span id="node-version"></span>,
    Chromium <span id="chrome-version"></span>,
    and Electron <span id="electron-version"></span>.

    <！-- 您也可以此进程中运行其他文件 -->
    <script src="./renderer.js"></script>
  </body>
</html>
```

index.html这个文件没啥好说的，preload.js这个文件和那个显示nodejs版本号有关，这个我们可以暂时不关注，所以对于这个入门例子重点要关注的就是main.js这个文件。




## 加载本地文件

加载本地文件或者URL都推荐统一采用 `loadURL` 方法：

```
mainWindow.loadURL(path.join('file://', __dirname, 'index.html'))
```

这里的 `__dirname` 就是你当前执行js脚本所在的目录位置，上面加上 `file://` ，这样就可以实现加载本地文件。

## 自定义菜单栏

如果你设置mainWindow的frame属性为false：

```
  mainWindow = new BrowserWindow({
    width: 800, height: 700, backgroundColor: '#fff',
    frame: false
  })
```

则你会看到一个无框的窗体，当然菜单栏也不存在了，不知道这是不是你要的。

或者你也可以设置：

```
mainWindow.autoHideMenuBar = true
```

这样菜单栏会自动隐藏，这可能就是你想要的效果。

或者你想彻底删除菜单栏：

```
mainWindow.removeMenu()
```

那么我们怎么定义自己的菜单栏呢，在createWindow函数下加入如下动作：

```javascript
  const template =
    [
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' }
        ]
      },
      {
        role: 'window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      }
    ]

  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
```

注意上面的Menu需要前面引入进来：

```
const {app, BrowserWindow, Menu} = require('electron')
```

如果你设置：

```
Menu.setApplicationMenu(null);
```

也可以实现一种无菜单效果。上面的 `role` 开头的菜单是内置的，然后 `{ type: 'separator' }` 是加上一个分隔符，你也可以如下定义自己的菜单和动作：

```javascript
        {
          label: 'Hello',
          accelerator: 'Shift+CmdOrCtrl+H',
          click() {
              console.log('Oh, hi there!')
          }
        }
```

label是显示的文字，accelerator是快捷键，第三个是关联的函数对象。

## 项目结构推荐

项目结构根目录放上 `package.json` 和其他一些文件即可，项目相关的内容待编译处理的放入 `src` 目录，不用编译处理的放入 `app` 目录。然后有一个特别需要强调的点，那就是建议新建一个文件夹 `resources` ，里面放着 `electron-builder` 在build过程中需要用到的一些文件，这些文件不会送入`app.asar` 中去的。具体配置是：

```
  "build": {
    "appId": "io.a358003542.yaogua2",
    "productName": "yaogua2",
    "directories": {
      "buildResources": "resources"
    },
```

下面在讨论electron-builder的时候会提到，一些图标文件都会默认试着从那个文件夹下去找。

## 制作安装包

继续上面的讨论，需要利用 electron-builder 来制作安装包，其也是一个npm包，类似上面的先安装一下：

```
yarn add electron-builder --dev
```

electron-builder的官方文档对于初次接触这块的来说我估计会非常难懂，我之前还是接触过nsis的仍然在某些地方读之不明所以。

现在来看一下我这边的 `package.json` 下的 build字段情况：

```
  "build": {
    "appId": "io.a358003542.yaogua2",
    "productName": "yaogua2",
    "directories": {
      "buildResources": "resources"
    },
    "win":{
      "target":[
        "nsis"
      ]
    },
    "nsis":{
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "license": "LICENSE"
    }
  }
```

一般配置信息在官方文档的 [这里](https://www.electron.build/configuration/configuration) ，win这个字段下面的配置信息在官方文档的 [这里](https://www.electron.build/configuration/win) ，nsis这个字段下面的配置信息在官方文档的 [这里](https://www.electron.build/configuration/nsis) 。

首先说明一下上面配置的win字段是可以省略的，这里写出来是为了清晰地表明electron-builder在windows平台下默认输出目标nsis，然后对应的下面的nsis的一些配置我们可以具体定制安装包的一些行为。 

比如win下面有个字段 `icon` ，其默认值是 `build/icon.ico` ，所以我们把icon.ico这个图标文件放入resources文件夹下即可。

比如nsis下面有很大一段是关于icon图标的，其默认对应的就是resources文件夹下某个图标。

`oneClick` 默认是true，安装包是一键安装模式，nsis什么界面信息都没有弹出来。

`allowToChangeInstallationDirectory` 默认是false，改为true这样将会出现一个提示用户更改安装目录的界面。

`license` 可以设置指向LICENSE文件来弹出许可证协议界面。

还要其他一些选项这里就不赘述了，请查阅官方文档。

## 其他

### 整合python项目

经过本人查阅多个资料，最后确认electron项目里面如果想整合python项目比如flask项目的话，不管是决定采用http api风格还是rpc风格，最终都需要利用pyinstaller将你的python项目做成单独的exe形式，然后通过electron来开启子线程来启动一个后台api服务。具体如下所示：

```javascript
let pyProc = null

const startPythonSubprocess = () => {
  pyProc = require('child_process').execFile(python_project_exe)
}

const exitPyProc = () => {
  pyProc.kill()
  pyProc = null
}

app.on('ready', startPythonSubprocess)
app.on('will-quit', exitPyProc)
```

### 参考资料

1. [cant-add-icon-to-electron-app-with-electron-builder](https://stackoverflow.com/questions/60273475/cant-add-icon-to-electron-app-with-electron-builder/60319954#60319954)
2. [what-is-the-purpose-of-buildresources-folder-in-electron-builder-building-proces](https://stackoverflow.com/questions/54978918/what-is-the-purpose-of-buildresources-folder-in-electron-builder-building-proces)