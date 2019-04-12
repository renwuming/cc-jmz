cc.Class({
    extends: cc.Component,

    properties: {
        input: {
            type: cc.Prefab,
            default: null,
        },
        submit: {
            type: cc.Button,
            default: null,
        },
        code: {
            type: cc.Label,
            default: null,
        },
        inputlist: [],
    },

    init(data) {
        this.node.active = true
        if (this.inputlist.length < 1) {
            for (let i = 0; i < 3; i++) {
                let input = cc.instantiate(this.input)
                this.node.addChild(input)
                input = input.getComponent('Input')
                let X = i * 300 - 300
                let Y = -20
                input.init({
                    position: [X, Y],
                    bk: Global.spaceColors[data[i]],
                    code: data[i] + 1,
                })
                this.inputlist.push(input)
            }
        } else {
            for (let i = 0; i < 3; i++) {
                const input = this.inputlist[i]
                input.init({
                    bk: Global.spaceColors[data[i]],
                    code: data[i] + 1,
                })
            }
        }

        this.code.string = data.map(n => n + 1).join('.')
    },


    start() {
        this.submit.node.on('click', function () {
            const desList = this.inputlist.map(input => {
                const text = input.node.getComponent(cc.EditBox).string
                return text
            })
            if (desList.some(text => !text)) { // 某项描述为空
                alert('请您正确填写！')
                return
            }
            Global.Post({
                url: `/games/${Global.GAME_ID}/submit`,
                reqData: {
                    code: desList,
                },
            }).then(res => {
                this.node.active = false // 隐藏提交button
                this.inputlist.forEach(input => {
                    input.reset()
                })
                alert('提交成功！')
            })
        }, this);
    },

    // update (dt) {},
});
