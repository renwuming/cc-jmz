
const spaceColors = [new cc.Color(220, 220, 220), new cc.Color(200, 200, 200), new cc.Color(180, 180, 180), new cc.Color(160, 160, 160)]
const styleDark = {
    spaceColors,
    textColor: new cc.Color(145, 215, 254),
    textColor2: new cc.Color(76, 138, 75),
    textColor3: new cc.Color(7, 21, 30),
    stringColor: new cc.Color(177, 114, 88),
    bkColor: new cc.Color(28, 28, 28),
    bkColor2: new cc.Color(185, 217, 255),
    rightColor: new cc.Color(76, 138, 75),
    wrongColor: new cc.Color(28, 28, 28),
    wordBkColor: new cc.Color(91, 28, 28),
}
const styleLight = {
    spaceColors,
    textColor: new cc.Color(145, 215, 254),
    textColor2: new cc.Color(76, 138, 75),
    textColor3: new cc.Color(7, 21, 30),
    stringColor: new cc.Color(177, 114, 88),
    bkColor: new cc.Color(255, 255, 255),
    bkColor2: new cc.Color(185, 217, 255),
    rightColor: new cc.Color(76, 138, 75),
    wrongColor: new cc.Color(28, 28, 28),
    wordBkColor: new cc.Color(160, 160, 160),
}


window.Global = {
    moveDistance: 5,
    REQUEST_DELAY: 4000,
    sleep: delay => new Promise((resolve => {
        setTimeout(resolve, delay)
    })),
    getQuery: key => {
        const result = location.search.substr(1).match(new RegExp('(?:^|&)' + key + '=(.+?)(?:$|&)'));
        return result ? result[1] : result
    },
    runAction: (node, action) => {
        let tag = Math.floor(Math.random() * 999)
        action.setTag(tag)
        node.runAction(action)
        return new Promise(resolve => {
            let timer = setInterval(() => {
                if (action.isDone()) {
                    clearInterval(timer)
                    resolve()
                }
            }, 50)
        })
    },
    Get: function (obj) {
        let { url, reqData } = obj
        url += "?"
        for (var item in reqData) {
            url += item + "=" + reqData[item] + "&"
        }
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        let response = xhr.responseText
                        if (response) response = JSON.parse(response)
                        resolve(response)
                    } else {
                        reject()
                    }
                }
            }
            xhr.open("GET", `${this.urlPrefix}${url}`, true)
            xhr.withCredentials = true
            xhr.send()
        })
    },
    Post: function (obj) {
        let { url, reqData } = obj
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 400) {
                        let response = xhr.responseText
                        if (response) response = JSON.parse(response)
                        resolve(response)
                    } else {
                        reject()
                    }
                }
            }
            xhr.open("POST", `${this.urlPrefix}${url}`, true)
            xhr.setRequestHeader('content-type', 'application/json')
            xhr.withCredentials = true
            xhr.send(JSON.stringify(reqData))
        })
    },
    getDistance(pos, pos2) {
        return Math.sqrt(Math.pow((pos.x-pos2.x),2)+Math.pow((pos.y-pos2.y),2))
    },
    getArea: function (pts, pts2) {
        let A = pts[1].x
        let B = pts[1].y
        let C = pts[3].x
        let D = pts[3].y
        let E = pts2[1].x
        let F = pts2[1].y
        let G = pts2[3].x
        let H = pts2[3].y

        //内部交叉区域（如果有）的四个边界
        let left = A > E ? A : E
        let right = C < G ? C : G
        let top = D < H ? D : H
        let bottom = B > F ? B : F

        //计算内部交叉区域面积，要考虑两个矩形可能不相交的情况
        let width = top > bottom ? (top - bottom) : 0
        let height = right > left ? (right - left) : 0
        let area = width * height
        return area
    },
    throttle: function (fn, delay) {
        let last = +new Date()
        return function () {
            let current = +new Date()
            if (current - last > delay) {
                fn.apply(this, arguments)
                last = current
            }
        }
    },
    handleText(text) {
        text = text.replace(/\n/, '')
        if (text.length > 10) {
            return text.substr(0, 10) + '…'
        }
        return text
    },
    // currentStyle: styleDark,
    currentStyle: styleLight,
    // urlPrefix: 'http://localhost:9999', // todo
    urlPrefix: 'https://www.renwuming.cn/jmz',
}


