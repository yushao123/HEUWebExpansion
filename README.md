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
