// ==UserScript==
// @name         学分统计、详细信息查看
// @namespace    http://www.yushao.xyz/
// @version      1.5
// @description  让你的HEU更好用
// @author       Yusho
// @match        *://*.hrbeu.edu.cn/*/cjcx_list
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @require      https://cdn.jsdelivr.net/npm/vue/dist/vue.js
// @require      https://cdn.jsdelivr.net/npm/heyui
// @resource css https://cdn.jsdelivr.net/npm/heyui/themes/index.css
// ==/UserScript==
// 配置区域

GM_addStyle(GM_getResourceText("css"));
var root = '<div id="app" style="margin-buttom:10px margin-top:10px">'
root += '<p><font color = "green">统计将会显示在这里</font></p>'
root += '<h-circle style="margin-right:10px margin-top:10px" v-for="one in datas" :key=one[0] :percent="one[2]/one[1] * 100" :stroke-width="12" :size="100">'
//root += '{{one[0]}}'
root += '<p class="gray-color"><span v-font="3">{{one[0]}}</span></p>'
root += '<p class="gray-color"><span class="primary-color" v-font="3">{{one[2]}}</span><span v-font="3">/{{one[1]}}</span></p>'
root += '</h-circle></div>'
$("#dataList").before(root)
unsafeWindow.app = new Vue({
    el: '#app',
    data: {
        datas: [["统计信息", 1, 1]],

    }, methods: {
        notice() {
            this.$Notice['info']("进度已经加载完毕")
        }
    }
})

unsafeWindow.Show = function (alldata = [], templates) {
    let getSum = courses => {
        let all = 0
        for (let course of courses) {
            all += parseFloat(course.学分)
        }
        return all
    }
    let  datas = []
    for (let template of templates) {
        datas.push([template[0], template[1], getSum(alldata.filter(template[2]))])
    }
    app.datas = datas
    app.notice()
}
unsafeWindow.JsMod = function (htmlurl, tmpWidth, tmpHeight) {
    htmlurl = getRandomUrl(htmlurl);
    htmlurl = `http://${document.domain}` + htmlurl
    var root = ""
    root += `<iframe src = ${htmlurl} height = "100%" width = "100%" style="border: medium none;"></iframe>`
    app.$Modal({
        title: "成绩细则",
        content: root,
        width: tmpWidth,
        buttons: [{
            type: 'cancel',
            name: '关闭'
        }],
        hasDivider: true
    })
}
unsafeWindow.getData = function () {
    ///数据获取
    var courseName = $('#dataList tbody tr td:nth-child(4)')// 课程名称
    var courseG = $('#dataList tbody tr td:nth-child(5)') //成绩
    var courseXueFen = $('#dataList tbody tr td:nth-child(6)') //学分
    var courseClassTime = $('#dataList tbody tr td:nth-child(7)') //总学时
    var courseTest_fangshi = $('#dataList tbody tr td:nth-child(8)') //考核方式
    var courseTesType = $('#dataList tbody tr td:nth-child(9)') //考试性质
    var courseClassType = $('#dataList tbody tr td:nth-child(10)') //课程属性
    var courseType = $('#dataList tbody tr td:nth-child(11)')//课程性质
    var courseSubType = $('#dataList tbody tr td:nth-child(12)')//通识教育类别
    var courseMark = $('#dataList tbody tr td:nth-child(13)')//成绩标记
    var alldata = []
    var data = {}
    for (var i = 0; i < courseG.length; i++) {
        data["课程名称"] = courseName[i].textContent
        data["成绩"] = courseG[i].textContent
        data['学分'] = courseXueFen[i].textContent
        data['总学时'] = courseClassTime[i].textContent
        data['考核方式'] = courseTest_fangshi[i].textContent
        data['考试性质'] = courseTesType[i].textContent
        data['课程属性'] = courseClassType[i].textContent
        data['课程性质'] = courseType[i].textContent
        data['通识教育选修课程类别'] = courseSubType[i].textContent
        data['成绩标记'] = courseMark[i].textContent
        alldata.push(data)
        data = {}
    }
    return alldata
}
unsafeWindow.hasStr = function (str, subStr) {
    var reg = eval("/" + subStr + "/ig");
    return reg.test(str);
}
unsafeWindow.IsPass = function (course) {
    //方便的判断是否几个
    let mark = course.成绩
    if (mark != "不合格") {
        if (!isNaN(parseFloat(mark))) {
            if (parseFloat(mark) >= 60) {
                return true
            }
        } else {
            return true
        }
    }
    return false
}

// A_C 现有过滤器
unsafeWindow.filters_A = course => { return hasStr(course.课程性质, "A") || hasStr(course.通识教育选修课程类别, "A0") & IsPass(course) }
unsafeWindow.filters_B = course => { return hasStr(course.课程性质, "B") & IsPass(course) }
unsafeWindow.filters_C = course => { return hasStr(course.课程性质, "C") & IsPass(course) }
unsafeWindow.filters_D = course => { return hasStr(course.课程性质, "D") & IsPass(course) }
unsafeWindow.filters_E = course => { return hasStr(course.课程性质, "E") & IsPass(course) }
unsafeWindow.filters_F = course => { return hasStr(course.课程性质, "F") & IsPass(course) }
unsafeWindow.filters_A0 = course => { return hasStr(course.通识教育选修课程类别, "A0") & IsPass(course) }
let type = [
    "课程名称",
    "成绩",
    '学分',
    '总学时',
    '考核方式',
    '考试性质',
    '课程属性',
    '课程性质',
    '通识教育选修课程类别',
    '成绩标记'
]
unsafeWindow.filters_all = function (course) {
    //过滤器模板
    //过滤合格的课 及成绩大于60或 不为不合格
    return IsPass(course)
}
unsafeWindow.filters_must = function (course) {
    //必修课
    return course.课程属性 == "必修" & IsPass(course.成绩)
}
unsafeWindow.filters_zx = function (course) {
    //专选课
    return hasStr(course.课程性质, "专业选修课") & IsPass(course.成绩)
}

unsafeWindow.filters_A = function (course) {
    //专选课
    return hasStr(course.课程性质, "A") || hasStr(course.通识教育选修课程类别, "A0")
}
//设置区域
//
let templates = [
    ["总学分", 164, filters_all],
    ["必修课程学分", 137, filters_must],
    ["专选课学分", 15, filters_zx],
    ['核心课学分', 26.5, course => { return hasStr(course.课程性质, "专业核心课") }],
    ['通识教育学分', 12, course => { return course.课程属性 == "公选" }],
    ["A_C总学分", 6, course => { return filters_A(course) || filters_B(course) || filters_C(course) & IsPass(course) }],
    ["B类学分", 1, filters_B],
    ["F类学分", 2, filters_F],
    ["A0类学分", 1, filters_A0]
]

Show(getData(), templates)
