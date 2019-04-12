
cc.Class({
    extends: cc.Component,

    properties: {
        space: {
            type: cc.Prefab,
            default: null,
        },
        spaces: [],
    },

    init(main, data) {
        this.MAIN = main
        // 设置坐标
        this.node.x = 0
        this.node.y = -150
        this.initSpaces(data)
    },

    initSpaces(data) {
        if(this.spaces.length < 1) {
            for(let i=0;i<4;i++) {
                let s = cc.instantiate(this.space)
                this.node.addChild(s)
                s = s.getComponent('Space')
                s.init(i, data[i] || {})
                this.spaces.push(s)
            }
        } else {
            for(let i=0;i<4;i++) {
                let s = this.spaces[i]
                s.init(i, data[i] || {})
            }
        }
    },

    updateWords(list) {
        list = list || ['??', '??', '??', '??']
        this.spaces.forEach((sp, index) => {
            sp.updateWord(list[index])
        })
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
