
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
        this.text.string = Global.handleText(text)
        // 设置坐标
        this.node.x = -this.node.width / 2
        this.node.y = -index * 50 + 170
        if (wrong) {
            this.text.node.color = new cc.Color(91, 82, 82)
        } else if (right) {
            this.text.node.color = Global.rightColor
        } else {
            this.text.node.color = bk
        }
    },


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
