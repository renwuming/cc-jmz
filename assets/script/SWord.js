
cc.Class({
    extends: cc.Component,

    properties: {
        text: {
            type: cc.Component,
            default: null,
        },
        bk: {
            type: cc.Component,
            default: null,
        },
    },

    init(data) {
        const { text, index, bk, wrong, right } = data
        this.realText = text
        this.text.string = Global.handleText(text)
        // 设置坐标
        this.node.x = -this.node.width / 2
        this.node.y = -index * 50 + 170
        if (wrong) {
            this.text.node.color = new cc.Color(91, 82, 82)
        } else if (right) {
            this.text.node.color = Global.currentStyle.rightColor
        } else {
            this.text.node.color = bk
        }
        const self = this
        // 显示tip
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            this.clickTime = +new Date()
            this.mouseMove = false
        }, this.node)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.mouseMove = true
        }, this.node)
        this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
            if(!this.mouseMove && +new Date() - this.clickTime < 200) {
                Global.MAIN.showTip(self.realText)
            }
        }, this.node)
    },


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
