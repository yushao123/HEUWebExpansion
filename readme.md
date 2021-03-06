# HEUWebExpansion

哈工程本科生成绩页面拓展

## 简介

### 功能简介

1. 自动按模板统计学分
2. 可在任意浏览器查看成绩细则
3. 后续将按需求拓展

### 必要插件

此拓展基于油猴插件,百度搜索如何安装油猴插件。

#### 获取方式

由于样式文件还未列入greasyfork.org,暂时只能通过GitHub上进行自行下载,安装至油猴插件中

### 使用方式

1. 在浏览器中安装油猴插件
2. 下载代码源文件,在油猴上通过本地安装

> 或者直接复制源代码,在油猴中新建脚本,粘贴,OK

### 使用的资源、修改的资源

1. 组件使用Vue渲染,源码中可以看到
2. 组件样式模板使用了HeyUi,引入了其样式文件以及其js脚本文件

> Vue的资源文件,HeyUi的资源文件均来自于其他CDN

> Vue实现文件     CDN地址 https://cdn.jsdelivr.net/npm/vue/dist/vue.js

> HeyUi的js脚本   CDN 地址https://cdn.jsdelivr.net/npm/heyui

> HeyUi的样式文件 CDN地址 https://cdn.jsdelivr.net/npm/heyui/themes/index.css

3. **修改了**原网页的JsMod函数,原函数声明于资源中的`js/common.js`文件中

> 其他网页不能查看成绩细则的原因在于JsMod函数中调用的showModalDialog()函数在IE浏览器之外的浏览器中并不存在,因此通过重写函数,添加了HeyUi的模态框,将细则页面添加到模态框中显示

## 配置

### 1.配置语句

配置语句源代码   找到**`//配置区域`**

> 显示模板让脚本显示你想要的东西

```javascript
let templates = [
    ["总学分", 164, filters_all],
    ...
]
```

上面便是一个最简单的统计模板，当前模板仅仅显示总学分，看上去很复杂？先慢慢看，包你看懂。

### 2.语句解释

修改的区域主要为这部分:

```javascript
["总学分", 164, filters_all],
...
```

需要关注的是最里面一层的`列表`或`数组`(如果你没听过这个词就忽略)

```javascript
["总学分"  ,164       ,filters_all]
"统计名称"  "总分要求"  "过滤器"
```

上面给出各个元素的对应的东西，统计名称决定进度条的标题，总分要求是总数，过滤器用于筛选出需要的课程

> 过滤器在之后会有详细描述

### 3.新的模板

```javascript
let templates = [
    ["总学分", 164, filters_all],
    ["A类总分", 2, filters_A],
]
```

上面添加了一条统计，它统计了所有学分和A类学分，**注意:两个之间其实有一个逗号，而且是英文逗号**

### 4.如何创建过滤器

#### 1）首先代码已经给出了下列过滤器

| 过滤器名称                     | 解释                                   |
| ------------------------------ | -------------------------------------- |
| filters_A                      | A类公选课课程过过滤器，统计A类         |
| filters_B                      | B类公选课课程过过滤器，统计B类         |
| 如上规律 存在CDEF A0类的过滤器 |                                        |
| filters_all                    | 所有成绩合格课程的过滤器，统计合成课程 |
| filters_must                   | 必修课过滤器，统计必修课               |
| filters_zx                     | 专业选修课过滤器，统计专业选修课       |

#### 2)创建自己的过滤器

###### 首先看一个比较简单的过滤器

```javascript
//IsPass 是已有函数，用来判断成绩是否合格
unsafeWindow.filters_all = function (course) {
    return IsPass(course)
}
```

上面是一个筛选成绩合格课程的过滤器(`filters_all`)，它实际上是一个函数，传入一个课程参数，返回了课程是否合格。

换句话说只有当课程合格的时候(即返回真的时候)，才能被这个过滤器选中。

###### 难一点的过滤器

```javascript
unsafeWindow.filters_must = function (course) {
    //必修课
    return course.课程属性 == "必修" & IsPass(course)
}
```

上面是必修课过滤器，统计必修课程。

我们这样看，必修课的课程属性为必修，那么当课程的课程属性等于”必修“的时候应当被选中。同时，它应该是合格的，因此与`IsPass`做了一次与(&)运算。

> 1.如果不需要强调一定合格可以不与合格判断进行与运算。默认的过滤器都进行了这个运算。
>
> 2.关于course.课程属性，它代表了课程的课程属性的值，点后面可以为下属性
>
> + 课程名称、成绩、学分、总学时、考核方式、考试性质、课程属性、课程性质、通识教育选修课程类别、成绩标记
>
> 实际对应了表格的一些列。

###### 尝试着自己做一个专业必修课的过滤器

注意:脚本中有一个函数叫`hasStr(a,b)`，它的功能是，判断字符串a中是否有字符串b，有则为真。

对着表格你可以知道，专业必修课的判别方式为，一行中的`课程属性`中存在”专业必修课“的字符，因此你的过滤器应该为:

```javascript
unsafeWindow.filters_zb = function (course) {
    //专业必修课
    return hasStr(course.课程属性,"专业必修课") & IsPass(course)
}
```

###### 过滤器的联级

在这里你大概率是能够自己写一个你自己的过滤器了，你可能兴奋不已。而我就要来打破你的自信:smiling_imp:。我只需要提一个要求，如果你能完成这个需求，那就是真的弄明白了(其实也就明白了怎么用:smirk:，但也足够了)。

废话少说，需求，制作一个筛选A-C类的过滤器。

你可能有许多方案，只要能实现就OK，我这里只是推荐用法，我称之为`过滤器的联级`。

在说明如何联级之前，我需要你知道过滤器本身是一个函数，它实际是会返回一个真假的，当它为真的时候，被后续选中。

```javascript
unsafeWindow.filters_A_C = function (course) {
    //A-C类课程过滤器
    return filters_A(course) || filters_A(course) || filters_A(course) & IsPass(course) 
}
```

看到上面或许你便明白了，其实如果我们将过滤器视作函数，那么当这个课满足A过滤器(函数)或者满足B或者满足C时便能统计A-C的课程了，最后再要求它合格，与IsPass 做且运算即可。

之所以推荐上诉方案，是因为上述写法的复用率很高，可读性也很高。到此你也就能够完完全全写出非常优秀的过滤器了。

## 其他

### 1.有关过滤器的实现

最底层时由js开发人员给定的一个filter高阶函数，它在列表类中。它需要用户传递一个函数作为第一参数，基本原理是，遍历列表的元素，每一次将元素传递给第一个参数这个函数，由用户制定规则，当返回真的时候，它保留这个元素，遍历完后返回最终筛选的列表。

### 2.最后亿句话

我只是一个来自航建学院的编程爱好者，语言都学了点，但都不能算专业，代码风格也是乱七八糟的，好多最后自己都很难看懂了，代码之中肯定还有许多写得不周到的地方，Bug也一定存在，尤其是JavaScript这类的语言，修Bug真的很难受。

整个源代码不算长，因此没有在前期想好结构，也就避免不了很乱，想到哪写到哪，还请各位大佬不要笑话。

至于油猴，其工作原理我还不是特别清楚，因为要重写JsMode函数，所以一定要将函数暴露到window下，但是直接使用window一直不行，最后使用了unsafewindow，不清楚是否还有其他解决办法。

希望大家能用得顺(No)利(Bug)。
