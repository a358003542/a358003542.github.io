Date: 20201018
Status: draft

[TOC]



## 简介

tesseract是开源界一款热门的OCR软件，闲话少说，现在开始慢慢研究这个软件，让OCR工作更快更精准把。

## CMAKE安装

我们可以在tesseract的 [github](https://github.com/tesseract-ocr/tesseract) 上看到其是用用C++写的，现在C语言或C++语言编写的项目大多是用的CMAKE来管理项目的编译构建工作的。首先是安装CMAKE，具体其windows也有相应的安装，已经很简便了，记得把cmake命令勾选为添加到系统PATH变量里面。

## 一个简单的样例项目

windows上的编译指导部分官方文档特别强调了这个简单的样例项目，这个样例项目就两个文件，其中main.cpp 就是通过C++语言来调用tesseract的，然后CMakeLists.txt 这个文件是和CMAKE编译工作相关的。

```cmake
cmake_minimum_required(VERSION 3.13)

project(tess_example CXX)

set(CMAKE_CXX_STANDARD 14)
set(SW_BUILD_SHARED_LIBS 1)
set(DEPENDENCIES
    org.sw.demo.google.tesseract.libtesseract-master
    org.sw.demo.intel.opencv.imgproc
    org.sw.demo.intel.opencv.highgui
)

find_package(SW REQUIRED)
sw_add_package(${DEPENDENCIES})
sw_execute()

add_executable(${PROJECT_NAME} main.cpp)
target_link_libraries(${PROJECT_NAME} ${DEPENDENCIES})

set_property(DIRECTORY ${CMAKE_CURRENT_SOURCE_DIR} PROPERTY VS_STARTUP_PROJECT ${PROJECT_NAME})
```



### cmake语法初识

```
cmake_minimum_required(VERSION 3.13)
```

这是让cmake的版本满足最小要求

```
project(tess_example CXX)
```

这是设置本项目的名字，第二个可选参数是本项目的语言。

```
add_executable(${PROJECT_NAME} main.cpp)
```

假设你的项目就一个main.cpp文件，则上面这句的效果就是明确根据main.cpp来输出 `{PROJECT_NAME}.exe` 这个可执行文件。

```
set(CMAKE_CXX_STANDARD 14)
```

这个相当于设置常量。

```
target_link_libraries(${PROJECT_NAME} ${DEPENDENCIES})
```

将目标文件和链接文件进行链接。

## sw

sw这个工具有点类似于python生态圈里面的pypi，其前面是cppan，专注于C++语言的生态圈，现在更名为Software Network，看得出来其野心是要做一个全软件的生态圈服务的。不管怎么说现在tesseract的CMAKE编译是依赖sw这个工具的。

### 安装sw

到 [sw官网](https://software-network.org/) 的 [这里](https://software-network.org/client/) 下载，然后设置好 `PATH` 环境变量即可。似乎第一次还需要运行：

```
sw setup
```

### sw和cmake的集成

在sw官方文档【20200809版】的2.4小节详细叙述了sw和cmake相关集成的写法，上面给出的CMakeLists.txt这个文件的最核心部分就是这里接下来要讨论的内容。

```
find_package(SW REQUIRED)
```

这是确保sw命令是存在的。

```
sw_add_package(${DEPENDENCIES})
```

这是添加本项目sw的相关依赖。

```
sw_execute()
```

这是执行sw来引入各个目标脚本。

```
add_executable(${PROJECT_NAME} main.cpp)
```



## cmake基本使用

这里不讨论其他额外的参数，就最基本的cmake管理的项目编译过程大体如下：

```
mkdir build
cd build
cmake ..
cmake --build .
```

一般是推荐另外新建一个build项目，然后在里面进行编译工作。

```
cmake ..
```

是根据上面的CMakeLists.txt文件进行本项目编译的预处理工作。

```
cmake --build .
```

调用cmake进行实际编译工作。

上面第一步主要是sw相关的软件依赖准备工作，这个过程需要开代理翻墙才能正常跑通。目前也似乎没有针对sw的国内源。

上面的第二步【20200813】我遇到了一个错误。具体定位大概是：

```
\.sw\storage\pkg\1d\13\e4d8\src\sdir\src\ccmain equationdetect.cpp
```

的这个文件的236行报错：error C3688 符号无法显示错误。具体代码是：

```
   //static const STRING kCharsToEx[] = {"'", "`", "\"", "\\", ",", ".",

   //  "〈", "〉", "《", "》", "」", "「", ""};

   static const STRING kCharsToEx[] = {"'", "`", "\"", "\\", ",", "."};
```

我如上将后面一些符号删掉了然后就跑的通了，暂时先不深究这个。

## 样例项目程序的使用

样例项目根据main.cpp出来的程序根据代码这一行判断：

```c++
if (tess.Init("./tessdata", "eng"))
    {
        std::cout << "OCRTesseract: Could not initialize tesseract." << std::endl;
        return 1;
    }
```

其需要读取模型文件，模型文件在 [这里](https://github.com/tesseract-ocr/tessdata) ，不需要都下下来，将 eng.traineddata 和 chi_sim.traineddata 下载下来即可。

目前cmake是正常将本机器上的visual studio相关C++环境识别出来了，所以它也输出了本项目的visual studio的解决方案文件，用visual studio加载这个文件然后对main.cpp进行一些修改是可以很快再生成解决方案的。类似的C++项目相关知识我就不过多说明了，我们到Debug文件夹下新建一个文件夹 `tessdata` ，然后将你下载下来的模型文件放进去。

继续往下看：

```
auto pixs = pixRead(argv[1]);
```

这是根据命令行的第一个参数读取图片。读者请自行制作额外的英文和中文测试图片，网页上截图即可。

```
tesseract::TessBaseAPI tess;

tess.SetImage(pixs);
tess.Recognize(0);

// get result and delete[] returned char* string
std::cout << std::unique_ptr<char[]>(tess.GetUTF8Text()).get() << std::endl;
```

简单的看代码知道setImage就是设置tess主接口当前要处理的图片，Recognize应该就是识别的意思，0这个参数意义不明，但这不是重点。然后就是输出，我们看到 `GetUTF8Text` ，这告诉我们其输出的文本是utf8编码的，这在后面给我带来了一点困扰。因为windows的powershell默认的936 gbk编码的，这样其将输出乱码，请将其调成65001 utf8编码 。

样例代码默认是加载英文模型，如果要处理中文需要加载中文模型，现在临时这样修改：

```c++
if (tess.Init("./tessdata", "chi_sim"))
    {
        std::cout << "OCRTesseract: Could not initialize tesseract." << std::endl;
        return 1;
    }
```

此外我还注意的tesseract-ocr还新提供了一个似乎针对LSTM训练效果更好的 [模型仓库](https://github.com/tesseract-ocr/tessdata_best) 。

针对同一图片下面是这两个模型运行效果比较：

![img]({static}/images/2020/tesseract_ch_comapre.png)

可以看到新的模型输出效果明显更好了。