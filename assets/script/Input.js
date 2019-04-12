cc.Class({
    extends: cc.Component,

    properties: {
        bk: {
            type: cc.Node,
            default: null,
        },
        placeholder: {
            type: cc.Label,
            default: null,
        },
    },


    init(data) {
        const { position, bk, code } = data
        // 设置坐标
        if(position) {
            this.node.x = position[0]
            this.node.y = position[1]
        }

        this.bk.color = bk
        this.placeholder.string = `代码${code}`
        this.placeholder.node.color = Global.textColor2
        this.placeholder.node.opacity = 255
        this.node.getComponent(cc.EditBox).fontColor = Global.bkColor
    },

    reset() {
        this.node.getComponent(cc.EditBox).string = ''
    },

    start() {

    },

    // update (dt) {},
});
