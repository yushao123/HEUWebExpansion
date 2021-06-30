# HEUWebExpansion

哈工程本科生成绩页面拓展

## 简介

### 功能简介

1. 自动按模板统计学分(不及格学分暂时未排除)
2. 可在任意浏览器查看成绩细则
3. 后续将按需求拓展

### 必要插件

此拓展基于油猴插件,百度搜索如何安装油猴插件。

### 获取方式

由于样式文件还未列入greasyfork.org,暂时只能通过GitHub上进行自行下载,安装至油猴插件中

## 使用方式

1. 在浏览器中安装油猴插件
2. 下载代码源文件,在油猴上通过本地安装

> 或者直接复制源代码,在油猴中新建脚本,粘贴,OK

## 使用的资源、修改的资源

1. 组件使用Vue渲染,源码中可以看到
2. 组件样式模板使用了HeyUi,引入了其样式文件以及其js脚本文件

> Vue的资源文件,HeyUi的资源文件均来自于其他CDN

> Vue实现文件     CDN地址 https://cdn.jsdelivr.net/npm/vue/dist/vue.js

> HeyUi的js脚本   CDN 地址https://cdn.jsdelivr.net/npm/heyui

> HeyUi的样式文件 CDN地址 https://cdn.jsdelivr.net/npm/heyui/themes/index.css

3. 修改了原网页的JsMod函数,原函数声明于资源中的`js/common.js`文件中

> 其他网页不能查看成绩细则的原因在于JsMod函数中调用的showModalDialog()函数在IE浏览器之外的浏览器中并不存在,因此通过重写函数,添加了HeyUi的模态框,将细则页面添加到模态框中显示

# 配置

### 1.配置语句

配置语句源代码   找到**`//配置区域`**

> 当前主要能配置统计的模板

```javascript
unsafeWindow.Show = function(data){
	//...其他代码
    var showtemplate = [
            ["总学分",164,data.XueFen.ALL],
        ]
    //...其他代码
}
```

上面便是一个最简单的统计模板，当前模板仅仅显示总学分，看上去很复杂？先慢慢看，包你看懂。

### 2.语句解释

修改的区域主要为这部分:

```javascript
var showtemplate = [
    ["总学分",164,data.XueFen.ALL],
]
```

需要关注的是最里面一层的列表(如果你没听过这个词就忽略)

```javascript
["总学分"  ,164       ,data.XueFen.ALL]
"统计名称"  "总分要求"  "统计的数"
```

上面给出各个元素的对应的东西，统计名称决定进度条的标题，总分要求是总数，统计的数为当前分数

### 3.新的模板

```javascript
unsafeWindow.Show = function(data){
	//...其他代码
    var showtemplate = [
            ["总学分",164,data.XueFen.ALL],
            ['A类总分',12,data.XueFen.A]
        ]
    //...其他代码
}
```

上面添加了一条统计，它统计了所有学分和A类学分，**注意:两个之间其实有一个逗号，而且是英文逗号**

### 4.如何计算学分

先分析下面代码:

```javascript
["总学分",164,data.XueFen.ALL],
['A类总分',12,data.XueFen.A]
```

观察`data.XueFen.ALL`变量，和`data.XueFen.A`变量，他们分别存放了总学分和A类学分。

**同样的还有以下方便计算的变量:**

```javascript
data.XueFen.A
data.XueFen.B
...
data.XueFen.G
// 上面为A-G类分数
data.XueFen.ALL // 总学分
data.XueFen.Must // 必修学分
data.XueFen.TongShi // 通识课学分
```

还没完，如果你够敏锐，你会发现**并没有计算专业学分的选项**

通过下面直接获取制定的分类总学分

```javascript
data.XueFen['19专业选修课程']
// 上面写法等价于data.XueFen.19专业选修课程
```

> 不同届的分类文本不同，因此采取这种方法。同样你还能使用`data.XueFen['19人文素质与文化传承（A）']`得到A类的学分。

> 关于data变量，如果想搞清楚结构怎么，我首先劝退，因为我自己都是很不清楚放了什么东西，如果你实在好奇，我还是会将在最后贴上结构。

并不是很难对吧，对吧。。。

现在我们可以得到下面的模板：

```javascript
unsafeWindow.Show = function(data){
	//... 其他代码
    var showtemplate = [
        ["总学分",164,data.XueFen.ALL],
        ["必修课程学分",164,data.XueFen.Must],
        ['专业选修课学分',15,data.XueFen['19专业选修课程']],
        ['专业核心课学分',26.5,data.XueFen['19专业核心课程']],
        ["其他专业课程",1,0],
        ['通识教育课程',12,data.XueFen.TongShi],
        ['A_C类总学分',6,data.XueFen.A + data.XueFen.B + data.XueFen.C],
        ["B类总学分",1,data.XueFen.B],
        ["F类总学分",2,data.XueFen.F],
        ["G类课程数",1,data.G.length],
	]
    //...其他代码
}
```

你应该能够看明白模板的大致内容了，但是注意最后一行模板**`["G类课程数",1,data.G.length]`**

这里涉及到data结构，如果你想获取某个课程的数量，模仿**`data.G.length`**获取

```javascript
G可以替换A-G
同时也可以替换为类似于['19专业选修课程']
// 同样data.['19专业选修课程'].length与data.19专业选修课程.length等价
```

## 其他

### 1.data结构

其实data结构并没有那么复杂，在分类之后，所有的课程分类会放在data字典中，同时为了方便统计，data下有A-G键值，直接得到A-G的分类数据。

同时data下有键`XueFen`,值为字典类型，存放每个类的学分统计，在data下访问的所有课程分类键，都能在data.XueFen下找到

而且data.XueFen下还有统计必修，总分，通识课的对应键分别为`Must` `All` `TongShi`

### 2.最后亿句话

我只是一个来自航建学院的编程爱好者，语言都学了点，但都不能算专业，代码风格也是乱七八糟的，好多最后自己都很难看懂了，代码之中肯定还有许多写得不周到的地方，Bug也一定存在，尤其是JavaScript这类的语言，修Bug真的很难受。

整个源代码不算长，因此没有在前期想好结构，也就避免不了很乱，想到哪写到哪，还请各位大佬不要笑话。

至于油猴，其工作原理我还不是特别清楚，因为要重写JsMode函数，所以一定要将函数暴露到window下，但是直接使用window一直不行，最后使用了unsafewindow，不清楚是否还有其他解决办法。

希望大家能用得顺(No)利(Bug)。
