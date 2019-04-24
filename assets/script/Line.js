cc.Class({
    extends: cc.Component,

    properties: {
        round: {
            type: cc.Label,
            default: null,
        },
        friend: {
            type: cc.Label,
            default: null,
        },
        enemy: {
            type: cc.Label,
            default: null,
        },
        right: {
            type: cc.Label,
            default: null,
        },
        friendBk: {
            type: cc.Node,
            default: null,
        },
        enemyBk: {
            type: cc.Node,
            default: null,
        },
    },

    init(data) {
        const { index, answerF, answerE, codes } = data

        if (index % 2) {
            this.node.x = 230
            this.node.y = -Math.floor(index / 2) * 50 + 210
        } else {
            this.node.x = -230
            this.node.y = -Math.floor(index / 2) * 50 + 210
        }
        this.round.string = index + 1
        if (answerE.red) {
            this.enemy.string = answerE.text
            this.enemyBk.color = Global.currentStyle.rightColor
            this.enemy.node.color = new cc.Color(255, 255, 255)
        } else if(answerE.black) {
            this.enemy.string = answerE.text
            this.enemyBk.color = Global.currentStyle.wrongColor
            this.enemy.node.color = new cc.Color(255, 255, 255)
        } else {
            this.enemy.string = answerE
        }
        if (answerF.black) {
            this.friend.string = answerF.text
            this.friendBk.color = Global.currentStyle.wrongColor
            this.friend.node.color = new cc.Color(255, 255, 255)
        } else if(answerF.red) {
            this.friend.string = answerF.text
            this.friendBk.color = Global.currentStyle.rightColor
            this.friend.node.color = new cc.Color(255, 255, 255)
        } else {
            this.friend.string = answerF
        }
        this.right.string = codes
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
