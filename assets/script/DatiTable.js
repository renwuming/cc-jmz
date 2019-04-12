cc.Class({
    extends: cc.Component,

    properties: {
        word: {
            type: cc.Prefab,
            default: null,
        },
        submit: {
            type: cc.Button,
            default: null,
        },
        result: {
            type: cc.Prefab,
            default: null,
        },
        wlist: [],
        results: [],
    },
    init(type, list) {
        this.node.active = true
        this.node.menuTag = type
        if (this.wlist.length < 1) {
            list.forEach((text, index) => {
                let w = cc.instantiate(this.word)
                this.node.addChild(w)
                w = w.getComponent('Word')
                let X = index * 300 - 300
                let Y = -20
                w.init({
                    text,
                    position: [X, Y],
                })
                this.wlist.push(w)
            })
        } else {
            list.forEach((text, index) => {
                const w = this.wlist[index]
                w.init({
                    text,
                })
            })
        }

        this.initResults()
    },

    initResults() {
        if (this.results.length < 1) {
            this.wlist.forEach((word, index) => {
                let r = cc.instantiate(this.result)
                this.node.addChild(r)
                r = r.getComponent('Result')
                let X = index * 300 - 300
                let Y = -20
                r.init(word, [X, Y])
                this.results.push(r)
            })
        } else {
            this.wlist.forEach((word, index) => {
                let r = this.results[index]
                r.init(word)
            })
        }
    },


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.zIndex = 1000
    },

    start() {
        this.submit.node.on('click', function () {
            const desList = this.results.map(r => {
                return r.text.string
            })
            if (desList.some(text => !text)) { // 某项描述为空
                alert('请您正确填写！')
                return
            }
            Global.Post({
                url: `/games/${Global.GAME_ID}/submit`,
                reqData: {
                    code: desList.map(n => n - 1),
                },
            }).then(res => {
                if(res.code) {
                    alert('提交失败！')
                } else {
                    alert('提交成功！')
                }
                this.node.active = false // 隐藏提交button
                this.wlist.forEach(word => {
                    word.resetBack()
                })
            })
        }, this);
    },

});
