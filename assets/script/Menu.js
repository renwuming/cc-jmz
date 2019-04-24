cc.Class({
    extends: cc.Component,

    properties: {
        text: {
            type: cc.Label,
            default: null,
        },
        bk: {
            type: cc.Node,
            default: null,
        },
    },


    onLoad() {
        this.initText = [
            '我\n方\n加\n密\n卡',
            '敌\n方\n拦\n截\n卡',
            '敌\n方\n加\n密\n卡',
            '战\n绩\n记\n录',
        ]
        this.bk.color = Global.currentStyle.bkColor
        this.text.node.color = Global.currentStyle.textColor2
    },

    show() {
        this.bk.color = Global.currentStyle.bkColor2
        this.text.node.color = Global.currentStyle.textColor3
    }, 

    reset() {
        this.bk.color = Global.currentStyle.bkColor
        this.text.node.color = Global.currentStyle.textColor2
    },

    init(main, data) {
        this.MAIN = main
        const { position, type } = data
        this.text.string = this.initText[type]
        // 设置坐标
        this.node.x = position[0]
        this.node.y = position[1]

        this.type = type

        const self = this
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.MAIN.changeMenu(self.type)
        }, this.node)
    },

    // update (dt) {},
});
