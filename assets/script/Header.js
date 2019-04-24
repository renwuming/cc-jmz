cc.Class({
    extends: cc.Component,

    properties: {
        mainText: {
            type: cc.Label,
            default: null,
        },
        FText: {
            type: cc.Label,
            default: null,
        },
        EText: {
            type: cc.Label,
            default: null,
        },
        codeText1: {
            type: cc.Node,
            default: null,
        },
        codeText2: {
            type: cc.Node,
            default: null,
        },
        codeText3: {
            type: cc.Node,
            default: null,
        },
        teamText1: {
            type: cc.Label,
            default: null,
        },
        teamText2: {
            type: cc.Label,
            default: null,
        },
        roundText: {
            type: cc.Label,
            default: null,
        },
        winBox: {
            type: cc.Node,
            default: null,
        },
    },

    handleGameResult(teamNames, winner) {
        this.winBox.active = true
        const winText = this.winBox.getChildByName('result').getComponent(cc.Label)
        if (winner >= 0) {
            winText.string = `${teamNames[winner]}队获胜！`
        } else {
            winText.string = '平局！'
        }

    },

    updateText(data) {
        const { battle, userIndex, userList, activeBattle, teamNames } = data
        const { desTeam, desUser, question, answerF, answerE } = battle
        const desUserIndex = desUser + desTeam * 2
        this.teamIndex = Math.floor(userIndex / 2)
        const desNick = ` ·${userList[desUserIndex].nick}· `
        const fNick = ` ·${userList[desUserIndex % 2 ? desUserIndex - 1 : desUserIndex + 1].nick}· `
        const eIndex = 3 - desUserIndex
        const eNick = ` ·${userList[eIndex].nick}· `

        if (!question) {
            this.mainText.string = `${teamNames[desTeam]}队${desNick}正在加密…`
        } else {
            this.mainText.string = `${teamNames[desTeam]}队${desNick}已提交加密`
        }
        if (!answerF) {
            if (!question) this.FText.string = `${teamNames[desTeam]}队${fNick}正在等待解密`
            else this.FText.string = `${teamNames[desTeam]}队${fNick}正在解密…`
        } else {
            this.FText.string = `${teamNames[desTeam]}队${fNick}已提交解密`
        }
        if (activeBattle <= 1) {
            this.EText.string = ``
        } else if (!answerE) {
            if (!question) this.EText.string = `${teamNames[1 - desTeam]}队${eNick}正在等待拦截`
            else this.EText.string = `${teamNames[1 - desTeam]}队${eNick}正在拦截…`
        } else {
            this.EText.string = `${teamNames[1 - desTeam]}队${eNick}已提交拦截`
        }

        this.handleQuestion(question)
        this.handleTeamText(userList, teamNames)
        this.roundText.string = `- 第 ${activeBattle + 1} 回合 -`
    },

    handleQuestion(question) {
        if (!question) {
            this.codeText1.active = false
            this.codeText2.active = false
            this.codeText3.active = false
            return
        }
        this.codeText1.active = true
        this.codeText2.active = true
        this.codeText3.active = true
        question = question.map(Global.handleText)
        this.codeText1.getChildByName('text').getComponent(cc.Label).string = question[0]
        this.codeText2.getChildByName('text').getComponent(cc.Label).string = question[1]
        this.codeText3.getChildByName('text').getComponent(cc.Label).string = question[2]
    },

    handleTeamText(userList, teamNames) {
        userList = userList.map(user => user.nick)
        this.teamText1.string = `${teamNames[0]}队：${userList[0]} ${userList[1]}`
        this.teamText2.string = `${teamNames[1]}队：${userList[2]} ${userList[3]}`

    },

    start() {
        this.node.color = Global.currentStyle.bkColor
        this.node.children.forEach(node => {
            node.color = Global.currentStyle.textColor2
        })
        this.winBox.color = Global.currentStyle.bkColor
    },

    // update (dt) {},
});
