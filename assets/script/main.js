require('./Global')

cc.Class({
    extends: cc.Component,

    properties: {
        table: {
            type: cc.Prefab,
            default: null,
        },
        menu: {
            type: cc.Prefab,
            default: null,
        },
        bk: {
            type: cc.Node,
            default: null,
        },
        Header: {
            type: cc.Node,
            default: null,
        },
        DatiTableF: {
            type: cc.Component,
            default: null,
        },
        DatiTableE: {
            type: cc.Component,
            default: null,
        },
        ChutiTable: {
            type: cc.Component,
            default: null,
        },
        HistoryTable: {
            type: cc.Node,
            default: null,
        },
        HomeBtn: {
            type: cc.Button,
            default: null,
        },
        tables: [],
        activeMenu: 0,
        stepFlag: 0, // 0 出题，1 回答队友的题目，2 回答对手的题目
        timer: 0,
    },

    updateChutiTable(data) {
        const t = this.ChutiTable.node.getComponent('ChutiTable')
        t.node.stepFlag = 0
        t.init(data)
    },

    updateDatiTableF(data) {
        const t = this.DatiTableF.node.getComponent('DatiTable')
        t.node.stepFlag = 1
        t.init(0, data)
    },

    updateDatiTableE(data) {
        const t = this.DatiTableE.node.getComponent('DatiTable')
        t.node.stepFlag = 2
        t.init(2, data)
    },

    updateTable(type, data) {
        if (!this.tables[type]) {
            let mT = cc.instantiate(this.table)
            this.node.addChild(mT)
            mT = mT.getComponent('Table')
            mT.node.menuTag = type
            this.tables[type] = mT
        }
        this.tables[type].init(this, data)
    },


    initMenus() {
        this.menuList = []
        const X = -550
        for (let i = 0; i < 4; i++) {
            let menu = cc.instantiate(this.menu)
            this.node.addChild(menu)
            menu = menu.getComponent('Menu')
            menu.init(this, {
                type: i,
                position: [X, -i * 180 + 270]
            })
            this.menuList.push(menu)
        }
    },

    initMenus2(teamNames) {
        this.menuList[1].node.active = false
        this.menuList[0].text.string = `${teamNames[0].split('').join('\n')}\n队`
        this.menuList[2].text.string = `${teamNames[1].split('').join('\n')}\n队`
    },
    changeMenu(activeMenu) {
        if (activeMenu || activeMenu === 0) this.activeMenu = activeMenu
        this.node.children.forEach(node => {
            if (node.menuTag === undefined || node.menuTag === this.activeMenu) {
                if (/menu/i.test(node.name)) return
                if (/chuti|dati/i.test(node.name)) {
                    if (node.stepFlag === this.stepFlag) {
                        node.active = true
                    }
                } else {
                    node.active = true
                }
            } else {
                node.active = false
            }
        })
        this.menuList.forEach(menu => {
            if (menu.type === this.activeMenu) {
                menu.show()
            } else {
                menu.reset()
            }
        })
    },

    changeStep(step) {
        if (step >= 0) {
            if (step !== this.currentStep) {
                if (step == 2) this.changeMenu(step)
                else this.changeMenu(0)
            }
            this.currentStep = step
        }
        this.stepFlag = step
        this.bottomTables.forEach(t => {
            if (t.node.stepFlag === this.stepFlag && t.node.menuTag === this.activeMenu) {
                t.node.active = true
            } else {
                t.node.active = false
            }
        })
        if (this.stepFlag === 0) {
            this.ChutiTable.node.active = true
        } else {
            this.ChutiTable.node.active = false
        }
    },


    onLoad() {
        const manager = cc.director.getCollisionManager(); // 获取碰撞检测管理器
        manager.enabled = true
        // style设置
        cc.director.setClearColor(Global.currentStyle.bkColor)
        this.bk.color = Global.currentStyle.bkColor
        this.HomeBtn.node.getChildByName('Background').color = Global.currentStyle.bkColor

        Global.GAME_ID = Global.getQuery('id')

        this.initMenus()

        // 更新Table的数据
        this.updateTable(0, {})
        this.updateTable(1, {})
        this.updateTable(2, {})
        this.HistoryTable.menuTag = 3

        this.bottomTables = [
            this.DatiTableE,
            this.DatiTableF,
        ]
        this.changeMenu()


        this.getGameData()



        this.HomeBtn.node.on('click', function () {
            window.open('https://www.renwuming.cn/jmz-fe/')
        }, this)
    },

    updateHistory2(historyData) {
        const tableData0 = {},
            tableData1 = {},
            tableData2 = {}
        historyData.forEach(battle => {
            const { desTeam, question, codes, answerE } = battle
            if (desTeam === 0) { // 队伍一的数据
                codes.forEach((code, index) => {
                    if (tableData0[code]) tableData0[code].textList.push(question[index])
                    else tableData0[code] = {
                        textList: [question[index]],
                    }
                })
            } else {
                codes.forEach((code, index) => {
                    if (tableData2[code]) tableData2[code].textList.push(question[index])
                    else tableData2[code] = {
                        textList: [question[index]],
                    }
                })
            }
        })
        this.updateTable(0, tableData0)
        this.updateTable(1, tableData1)
        this.updateTable(2, tableData2)
    },

    updateHistory(userIndex, historyData) {
        if (userIndex < 0) { // 若为旁观状态
            this.updateHistory2(historyData)
            return
        }
        const tableData0 = {},
            tableData1 = {},
            tableData2 = {}
        const teamIndex = Math.floor(userIndex / 2)
        historyData.forEach(battle => {
            const { desTeam, question, codes, answerE } = battle
            if (teamIndex === desTeam) {
                codes.forEach((code, index) => {
                    if (tableData0[code]) tableData0[code].textList.push(question[index])
                    else tableData0[code] = {
                        textList: [question[index]],
                    }
                })
                // 我方出题时候，对方的答题情况
                codes.forEach((code, index) => {
                    const EnemyAnswer = (answerE || {})[index]
                    if (!tableData1[EnemyAnswer]) tableData1[EnemyAnswer] = {
                        rightList: [],
                        wrongList: [],
                    }
                    if (EnemyAnswer === code) {
                        tableData1[EnemyAnswer].rightList.push(question[index])
                    } else {
                        tableData1[EnemyAnswer].wrongList.push(question[index])
                    }
                })
            } else {
                codes.forEach((code, index) => {
                    if (tableData2[code]) tableData2[code].textList.push(question[index])
                    else tableData2[code] = {
                        textList: [question[index]],
                    }
                })
            }
        })
        this.updateTable(0, tableData0)
        this.updateTable(1, tableData1)
        this.updateTable(2, tableData2)
    },

    getGameData() {
        Global.Get({
            url: `/games/${Global.GAME_ID}`,
        }).then(res => {
            if (res.code === 408) {
                window.location = `../login?callback=${encodeURIComponent(window.location)}`
                return
            }
            let { teamWords, battle, userIndex, history, sumList, gameOver, winner, teamNames, enemyWords, allWords, activeBattle } = res
            if (userIndex < 0) { // 旁观状态重置Menu
                this.initMenus2(teamNames)
                this.changeStep(-1)
            }
            const { desTeam, desUser, question, codes, answerE, answerF } = battle
            const desUserIndex = desUser + desTeam * 2
            const eIndex = 3 - desUserIndex
            if (allWords) {
                this.tables[0].updateWords(allWords[0]) // 展示双方词表
                this.tables[2].updateWords(allWords[1])
            } else {
                this.tables[0].updateWords(teamWords) // 展示我方词表
                this.tables[1].updateWords(teamWords) // 展示我方词表
                this.tables[2].updateWords(enemyWords) // 展示对方词表
            }
            if (userIndex === desUserIndex) { // 若我是出题者
                if (!question) {
                    this.updateChutiTable(codes)
                    this.changeStep(0)
                } else {
                    this.changeStep(-1)
                }
            } else {
                if (question) { // 若已经有题目
                    this.teamIndex = Math.floor(userIndex / 2)
                    if (this.teamIndex === desTeam && !answerF) { // 若为队友出题
                        this.updateDatiTableF(question)
                        this.changeStep(1)
                    } else if (this.teamIndex !== desTeam && !answerE && userIndex === eIndex && activeBattle > 1) { // 若为敌人出题
                        this.updateDatiTableE(question)
                        this.changeStep(2)
                    } else {
                        this.changeStep(-1)
                    }
                } else { // 还没有题目
                    this.changeStep(-1)
                }
            }
            this.Header.getComponent('Header').updateText(res)
            this.HistoryTable.getComponent('HistoryTable').init(history, sumList, teamNames)

            this.updateHistory(userIndex, history) // 区别是否旁观状态

            if (gameOver) {
                this.handleGameOver(teamNames, winner)
                clearTimeout(this.requestTimer)
                return
            }
        })
        this.requestTimer = setTimeout(this.getGameData.bind(this), Global.REQUEST_DELAY) // 递归不断执行
    },

    start() {
        // Global.Post({ // todo
        //     url: `/users`,
        //     reqData: {
        //         nick: 'renwuming',
        //         secret: '1',
        //     },
        // }).then(res => {
        //     console.log(res)
        // })
    },

    handleGameOver(teamNames, winner) {
        this.Header.getComponent('Header').handleGameResult(teamNames, winner)
        this.changeStep(-1)
    },
    update(dt) {
    },
});
