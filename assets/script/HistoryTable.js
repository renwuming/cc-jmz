cc.Class({
    extends: cc.Component,

    properties: {
        line: {
            type: cc.Prefab,
            default: null,
        },
        sumText1: {
            type: cc.Label,
            default: null,
        },
        sumText2: {
            type: cc.Label,
            default: null,
        },
        title1: {
            type: cc.Label,
            default: null,
        },
        title2: {
            type: cc.Label,
            default: null,
        },
        th1: {
            type: cc.Node,
            default: null,
        },
        th2: {
            type: cc.Node,
            default: null,
        },
        enemyColor: new cc.Color(204, 204, 204),
        lines: [],
    },

    handleSumAndTeamName(sumList, teamNames) {
        this.sumText1.string = `总分：${sumList[0]}`
        this.sumText2.string = `总分：${sumList[1]}`
        this.title1.string = `${teamNames[0]}队`
        this.title2.string = `${teamNames[1]}队`

        this.th1.getChildByName('t1').getComponent(cc.Label).string = `${teamNames[0]}解密`
        this.th1.getChildByName('t2').getComponent(cc.Label).string = `${teamNames[1]}拦截`
        this.th1.getChildByName('code').getComponent(cc.Label).string = `${teamNames[0]}代码`
        this.th2.getChildByName('t1').getComponent(cc.Label).string = `${teamNames[1]}解密`
        this.th2.getChildByName('t2').getComponent(cc.Label).string = `${teamNames[0]}拦截`
        this.th2.getChildByName('code').getComponent(cc.Label).string = `${teamNames[1]}代码`

    },

    init(list, sumList, teamNames) {
        this.handleSumAndTeamName(sumList, teamNames)
        this.lines.forEach(l => {
            l.node.destroy()
        })
        this.lines = []

        const tableList = []
        list.forEach((round, index) => {
            let { answerE, answerF, codes } = round
            answerF = answerF.map(n => n + 1).join('.')
            answerE = answerE.map(n => n + 1).join('.')
            codes = codes.map(n => n + 1).join('.')
            if (answerF !== codes) {
                answerF = {
                    text: answerF,
                    black: true,
                }
            }
            if (answerE === codes) {
                answerE = {
                    text: answerE,
                    red: true,
                }
            }
            tableList.push({
                answerE,
                answerF,
                codes,
                index,
            })

        })

        tableList.forEach(data => {
            let l = cc.instantiate(this.line)
            this.node.addChild(l)
            l = l.getComponent('Line')
            l.init(data)
            this.lines.push(l)
        })
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    },


    // update (dt) {},
});
