Slug: unity-editor
Tags: unity

[TOC]

## 前言

本文是Unity游戏开发系列的编辑器编码部分。

### 本系列内容的取舍

- 因为笔者开发的是3D游戏，因此专属于2D游戏的那些内容将不会在这里讨论。
- 笔者使用的是Unity 2020.3 LTS版本，之前的版本被废弃的特性或者之后的版本新增的特性将不会在这里讨论。
- 笔者在行文上会尽可能节省笔墨，只是标出官方参考文档的引用出处，但在某些地方会额外花费笔墨来说明，比如个人觉得官方文档文字可能不是很好懂，某些内容很重要需要再特别强调一遍等。



## MenuItem

为你的unity编辑器添加一个菜单项。

```
public class EditorHelloWorld : EditorWindow
{
    [MenuItem("Tools/STStudio/Utilities/HelloWorld", false)]
    private static void ShowWindow()
    {
        EditorWindow.GetWindow(typeof(EditorHelloWorld));
    }

    private void OnGUI()
    {
    }
}
		
```

第二个参数如果是false则就是创建菜单项点击之后的动作，如果是true则下面的函数是校验函数，如果该校验函数返回false则菜单项将是禁用状态。

## 属性值

### TextAreaAttribute

这会让你的字符串有一个更宽的文本输入区域。

```
using UnityEngine;

public class TextAreaExample : MonoBehaviour
{
    [TextArea]
    public string MyTextArea;
}
```



### TooltipAttribute

给Unity编辑器的某个字段增加一个提示信息，当鼠标悬停的时候会弹出这个提示信息。

```
using UnityEngine;

public class Example : MonoBehaviour
{
    [Tooltip("Health value between 0 and 100.")]
    int health = 0;
}
```



### 自定义属性

如下 `Header` 是自定义的属性：

```
	[Header("Persistent managers Scene")]
```

添加一个属性Header，则会在编辑器的Inspector窗口上添加一个标题头，你也可以自定义自己的属性装饰函数。

```c#
	public class HeaderLineAttribute : PropertyAttribute {

		public readonly string header;
		
		public HeaderLineAttribute(string header)
		{
			this.header = header;
		}
	}
```

如上定义了一个 `HeaderLineAttribute` 属性装饰函数，实际使用是：

```
[HeaderLine("Input")]
```

【似乎如果该类的名字有Attribute则会省略。】

然后该属性装饰函数你可以定义属性绘制类：

```c#
	[CustomPropertyDrawer (typeof(HeaderLineAttribute))]
	public class HeaderLineDrawer : DecoratorDrawer
	{
		public HeaderLineDrawer ()
		{
		}
	}
```

DecoratorDrawer类似PropertyDrawer，区别就是DecoratorDrawer不绘制属性，除了从对应的PropertyAttribute对象那里获取的数据。

具体绘图是根据 `OnGUI`  重载方法来的。

## 完全定制类的Inspector视图

属性值只是一个影响类的Inspector视图的方式，你还可以对你编写的类完全来定义Inspector视图。

### 第一个例子

现在假设你定义了一个SomeScript类，其继承自MonoBehaviour，然后你希望定制这个SomeScript组件在Unity编辑器上的Inspector视图。一个简单的编辑器定制代码如下所示：

```c#
using UnityEditor;

[CustomEditor(typeof(SomeScript))]
public class SomeScriptEditor : Editor
{
    public override void OnInspectorGUI()
    {
        SomeScript someScript = (SomeScript)target;

        someScript.experience = EditorGUILayout.IntField("Experience", someScript.experience);

        EditorGUILayout.LabelField("Label: ", someScript.Level.ToString());
    }
}
```

1. `using UnityEditor;` 一般进行Unity Editor开发需要引入这个命名空间。
2. 关于Editor的类是继承自 `Editor` 这个类。
3. `[CustomEditor(typeof(SomeScript))]`  指明你要定制那个类的Inspector视图。
4. 重载override `OnInspectorGUI` 方法来实现Inspector视图的定制。在`OnInspectorGUI` 方法里面 `target` 就是目标类对象。

### 添加一个整数值

```
someScript.experience = EditorGUILayout.IntField("Experience", someScript.experience);
```

上面接受两个参数，第一个参数是显示字符，第二个参数是整数值来源。

上面写成再一次赋值语句，应该是从编辑器那边修改值之后，然后修改值再回写回来。【个人尝试是如果不写成这种赋值语句修改值动作是无效的】

### 添加一个Lable

```
EditorGUILayout.LabelField("Label: ", someScript.Level.ToString());
```

上面接受两个字符串参数，其中第一个参数是左边的label，第二个参数是右边的label。

### 添加一个按钮

具体请参见下面的例子：

```c#
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(TestSerializableDict))]
public class TestSerializableDictEditor : Editor
{
    public override void OnInspectorGUI()
    {
        base.OnInspectorGUI();

        TestSerializableDict targetScript = (TestSerializableDict)target;
        if (GUILayout.Button("test"))
        {
            targetScript.Test();
        }
    }
}
```

上面代码如果点击按钮的话会执行 `TestSerializableDict` 脚本组件里面的Test方法。

上面的 `base.OnInspectorGUI();` 是将该脚本组件原来该有的属性视图都添加上，在 [这个网页](https://learn.unity.com/tutorial/editor-scripting) 提到 `DrawDefaultInspector();` 也有类似的作用，这两者是完全一样还是有细微的差异个人不太清楚。





### 默认显示动作

```
public override void OnInspectorGUI(){
    DrawDefaultInspector();
}
```

`DrawDefaultInspector` 方法会让你的自定义类显示先绘制默认的显示动作。

估计 `base.OnInspectorGUI` 的写法效果是一样的。

### EditorGUI和EditorGUILayout的区别

原则上Editor编码应该使用EditorGUI和EditorGUILayout，不过大致查了一下，要创建button还是需要通过GUILayout类。

EditorGUI和EditorGUILayout这两个类的区别是EditorGUILayout是自动布局的，比如说创建一个Lable：

```
# EditorGUI
public static void LabelField(Rect position, string label, GUIStyle style = EditorStyles.label);

# EditorGUILayout
public static void LabelField(string label, params GUILayoutOption[] options);
```

EditorGUILayout是不需要Rect这个参数的，而EditorGUI是需要Rect这个参数要指明本Label从哪里开始还有宽和高都是多少【前两个参数x，y定义了本矩形区域的左上角顶点，然后第三个参数是width，第四个参数是height。】。



## 附录

### serializedObject和target

在自定义编辑器类里面 `serializedObject` 和 `target` 都是引用当前Inspector的类对象，但是又有一些细微的差异。`serializedObject` 可以用下面的代码来理解：

```
serializedObject = new SerializedObject(targets);
```

target只是引用当前监视的第一个对象，而targets则是当前监视的多个对象【值得是Unity的多对象编辑操作】。一般实践新的代码都推荐使用serializedObject。上面讨论参考了 [这个网页](https://forum.unity.com/threads/editor-target-vs-editor-serializedobject.640072/)。

### SerializedObject

#### `FindProperty`

根据字符串返回指向SerializedObject某个属性的SerializedProperty。

```
SerializedProperty serializedPropertyMyInt = serializedObject.FindProperty("myInt");
```



### SerializedProperty

### ReorderableList

这个类在 `UnityEditorInternal` 命名空间里面，官方文档对这个类也语焉不详，但是是一个很好的表现列表的类，[这篇文章](https://va.lent.in/unity-make-your-lists-functional-with-reorderablelist/) 对这个类的讨论很有参考价值。

```c#
public ReorderableList(
	SerializedObject serializedObject, 
	SerializedProperty elements, 
    bool draggable, 
    bool displayHeader, 
    bool displayAddButton, 
    bool displayRemoveButton);
```

SerializedProperty可以是array，应该也可以是List。该对象还提供了很多回调属性：

- drawHeaderCallback
- drawElementCallback
- onSelectCallback
- onAddCallback
- drawElementBackgroundCallback

#### drawHeaderCallback

列表前面的Header回调方法，首先是：

```
list.drawHeaderCallback = new ReorderableList.HeaderCallbackDelegate(DrawHeader);

private void DrawHeader(Rect rect)
{
    EditorGUI.LabelField(rect, "Header");
}
```

这个回调方法没有赋值可能有默认的行为，赋值之后会使用再定义的回调方法。

#### drawElementCallback

绘制列表中的某一个元素的回调方法：

```
list.drawElementCallback = new ReorderableList.ElementCallbackDelegate(DrawElement);

private void DrawElement(Rect rect, int index, bool isActive, bool isFocused)
{
}
```

在回调方法里面，通过`GetArrayElementAtIndex` 方法来获取目标element，index是当前绘制的element索引值：

```
var element = serializedObject.FindProperty("list").GetArrayElementAtIndex(index);
```

通过 `FindPropertyRelative` 方法来获取目标element里面的属性值：

```
element.FindPropertyRelative("Name");
```





## 参考资料

1. Unity官方文档
2. Stack overflow
3. 其他模块文档
4. Unity商城Free资源
5. Learning c# by developing games with unity 2019 by Harrison Ferrone
6. Unity 游戏开发 by  Mike Geig
7. Mastering UI Development with Unity by Asheley Godbold
8. Unity in Action by Joseph Hocking
9. Unity Shader入门精要 by 冯乐乐
2. Mastering Unity Shaders and Effects by Jamie Dean

