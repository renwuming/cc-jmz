
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
        spaceList: [],
        areaList: [],
        box: null,
        inSpace: 0,
    },

    init(data) {
        let { text, position } = data
        this.realText = text
        this.text.string = Global.handleText(text)
        this.node.zIndex = 1000
        // 设置坐标
        if (position) {
            this.node.x = position[0]
            this.node.y = position[1]
            this.initPos = position
        }

    },

    handleSpace() {
        let huge = 0
        let hugeIndex = 0
        this.spaceList.forEach((space, index) => {
            let area
            if (this.areaList[index] < 0) {
                area = 0
            } else {
                area = Global.getArea(this.box.world.points, space.world.points)
            }
            this.areaList[index] = area
            if (area > huge) {
                huge = area
                hugeIndex = index
            }
        })
        this.inSpace = hugeIndex
        if (huge <= 0) {
            this.reset()
        }
        this.handleChange()
    },

    handleChange() {
        this.spaceList.forEach((sp, index) => {
            if (!sp) return
            sp = sp.node.getComponent('Space')
            if (index == this.inSpace) {
                sp.enterWord(this)
                this.bk.node.color = new cc.Color(255, 255, 255)
                this.text.node.color = sp.node.color
                this.inSpaceNode = sp
            } else {
                sp.leaveWord(this)
            }
        })
    },

    reset() {
        this.inSpace = -1
        this.endSpace = -1
        this.inSpaceNode = null
        this.bk.node.color = Global.currentStyle.wordBkColor
        this.text.node.color = new cc.Color(255, 255, 255)
    },
    resetBack() {
        this.reset()
        this.node.x = this.initPos[0]
        this.node.y = this.initPos[1]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        const self = this
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var delta = event.touch.getDelta()
            this.x += delta.x
            this.y += delta.y
            this.zIndex = 1000 // 移动中的word在前
            self.handleSpace()
            self.endSpace = -1
            this.mouseMove = true
        }, this.node)
        // 显示tip
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            this.clickTime = +new Date()
            this.mouseMove = false
        }, this.node)
        this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
            if(!this.mouseMove && +new Date() - this.clickTime < 200) {
                Global.MAIN.showTip(self.realText)
            }
        }, this.node)

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.zIndex = 0 // 停止移动的word在后
            const word = this.getComponent('Word')
            if (word.inSpace < 0) {
                word.resetBack()
            } else if (word.inSpaceNode) {
                const spaceNode = word.inSpaceNode
                this.x = -this.width / 2 + (spaceNode.node.parent.x - this.parent.x + spaceNode.node.x + spaceNode.node.width / 2 - 14)
                this.y = - spaceNode.swordLength * 50 + 170 + (spaceNode.node.parent.y - this.parent.y - 2)
                word.endSpace = word.inSpace
                word.inSpaceNode.uniqueWord(word)
            }
        }, this.node)

    },

    start() {
        this.bk.node.color = Global.currentStyle.wordBkColor
    },

    onCollisionEnter: function (other, self) {
        this.box = self
        let sp = other.getComponent('Space')
        if (!sp) return
        const { tag } = sp
        this.spaceList[tag] = other
    },
    onCollisionExit: function (other, self) {
        let sp = other.getComponent('Space')
        if (!sp) return
        const { tag } = sp
        this.areaList[tag] = -1
    },

    // update (dt) {},
})