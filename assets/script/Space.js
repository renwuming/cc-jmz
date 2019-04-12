cc.Class({
    extends: cc.Component,

    properties: {
        sword: {
            type: cc.Prefab,
            default: null,
        },
        No: {
            type: cc.Label,
            default: null,
        },
        Dui: {
            type: cc.Sprite,
            default: null,
        },
        Word: {
            type: cc.Sprite,
            default: null,
        },
        initColors: [],
        tag: 0,
        enterWords: [],
        swordList: [],
    },

    init(type, data) {
        this.initColors = Global.spaceColors
        this.initPos = [
            [-337.5, 0],
            [-112.5, 0],
            [112.5, 0],
            [337.5, 0],
        ]
        this.node.x = this.initPos[type][0]
        this.node.y = this.initPos[type][1]
        this.node.color = this.initColors[type]
        this.tag = type

        this.No.string = type + 1
        const flag = (type % 2) > 0
        this.Dui.node.zIndex = 100

        this.swordList = data.textList || []
        this.wrongList = data.wrongList || []
        this.rightList = data.rightList || []
        this.initSWord()
    },

    updateWord(word) {
        this.Word.node.active = true
        this.Word.node.color = Global.textColor2
        this.Word.node.children.forEach(node => {
            node.color = Global.textColor2
        })
        this.Word.node.getChildByName('bk').color = this.node.color
        this.Word.node.getChildByName('text').getComponent(cc.Label).string = word
    },

    enterWord(word) {
        this.enterWords.push(word)
        this.enterWords = [...new Set(this.enterWords)]
    },

    uniqueWord(word) {
        this.enterWords.forEach(w => {
            if (w !== word) {
                w.resetBack()
            }
        })
        this.enterWords = [word]
    },

    leaveWord(word) {
        const index = this.enterWords.indexOf(word)
        if (index >= 0) {
            this.enterWords.splice(index, 1)
        }
    },
    initSWord() {
        // 清除之前的sword
        this.node.children.forEach(node => {
            if (/sword/.test(node.name)) node.destroy()
        })
        let L = 0
        for (let i = 0; i < this.swordList.length; i++) {
            let sw = cc.instantiate(this.sword)
            this.node.addChild(sw)
            sw = sw.getComponent('SWord')
            sw.init({
                text: this.swordList[i],
                index: L,
                bk: this.initColors[this.tag],
            })
            L++
        }
        for (let i = 0; i < this.wrongList.length; i++) {
            let sw = cc.instantiate(this.sword)
            this.node.addChild(sw)
            sw = sw.getComponent('SWord')
            sw.init({
                text: this.wrongList[i],
                index: L,
                bk: this.initColors[this.tag],
                wrong: true,
            })
            L++
        }
        for (let i = 0; i < this.rightList.length; i++) {
            let sw = cc.instantiate(this.sword)
            this.node.addChild(sw)
            sw = sw.getComponent('SWord')
            sw.init({
                text: this.rightList[i],
                index: L,
                bk: this.initColors[this.tag],
                right: true,
            })
            L++
        }
        this.swordLength = L
    },
    addSWord(sword) {
        this.swordList.push(sword)
        this.initSWord()
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

    },

    start() {

    },

    update() {
    },

});
