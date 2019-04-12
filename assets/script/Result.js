cc.Class({
    extends: cc.Component,

    properties: {
        text: {
            type: cc.Label,
            default: null,
        },
    },

    init(word, position) {
        if(position) {
            this.node.x = position[0]
            this.node.y = position[1]
        }

        this.word = word
    },

    start() {

    },

    update(dt) {
        if (this.word.endSpace >= 0) {
            this.text.string = this.word.endSpace + 1
        } else {
            this.text.string = ''
        }
    },
});
