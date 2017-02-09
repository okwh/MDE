"use strict";
const node = require("./ast");
const stringBuffer_1 = require("../util/stringBuffer");
const EOF = '\0';
class Parser {
    constructor(_model) {
        this._continue = true;
        this._model = _model;
        this._indentStack = new Array();
        this._nodes = new Array();
        this._errors = new Array();
        this._prefixArray = [];
        this._parseState = {
            pos: {
                line: 1, offset: 0
            },
            finished: false,
        };
    }
    nextState() {
        if (this._parseState.pos.offset === this._model.lineAt(this._parseState.pos.line).length - 1) {
            if (this._parseState.pos.line === this._model.linesCount) {
                this._parseState.finished = true;
            }
            else {
                this._parseState.pos.line++;
                this._parseState.pos.offset = 0;
            }
        }
        else {
            this._parseState.pos.offset++;
        }
    }
    isFinished() {
        return this._parseState.finished;
    }
    match(char) {
        return this._lookahead == char;
    }
    lookahead() {
        return this._lookahead;
    }
    nextChar() {
        var _tmp = this._lookahead;
        if (this._parseState.finished)
            throw new Error("end of fine");
        this.nextState();
        this._lookahead = this._model.charAt(this._parseState.pos);
        return _tmp;
    }
    reportError(e, _continue) {
        this._errors.push(e);
        this._continue = _continue;
    }
    beginParsing() {
        var lineList = [];
        while (this.lookahead() !== EOF) {
            lineList.push(this.parseLine());
        }
    }
    eatingSpace() {
        var buf = new stringBuffer_1.StringBuffer();
        while (this.match(' ') || this.match('\t')) {
            buf.push(this.nextChar());
        }
        return buf.getStr();
    }
    parseLine() {
        var prefix = this.eatingSpace();
        this._prefixArray.push(prefix);
        switch (this.lookahead()) {
            case '#':
                return this.parseHeader();
            case '-':
                return this.parseUnorderList();
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                return this.parseOrderList();
            default:
                this.reportError(new Error("Unexpected token."), true);
        }
    }
    parseHeader() {
        var levelCount = 0;
        var buf = new stringBuffer_1.StringBuffer();
        if (!this.match('#'))
            this.reportError(new Error("header must begin with \"#\""), true);
        while (this.match('#')) {
            this.nextChar();
            levelCount++;
        }
        while (!this.match('#') && !this.match('\n')) {
            buf.push(this.nextChar());
        }
        while (this.match('#'))
            this.nextChar();
        return new node.HeaderNode(levelCount, buf.getStr());
    }
    parseText() {
        var _node = new node.TextNode();
        var buf = new stringBuffer_1.StringBuffer();
        while (!this.match('\n')) {
            buf.push(this.nextChar());
        }
        _node.children.push(new node.NormalTextNode(buf.getStr()));
        return _node;
    }
    parseOrderList() {
        let _node = new node.ListNode();
        return _node;
    }
    parseUnorderList() {
        let _node = new node.ListNode();
        return _node;
    }
    parseAnchor() {
    }
    parseBlockQuote() {
    }
    parseHTMLElement() {
    }
}
exports.Parser = Parser;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBRUQsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8sY0FBYztRQUNsQixJQUFJLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxnQkFBZ0I7UUFDcEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRU8sV0FBVztJQUVuQixDQUFDO0lBRU8sZUFBZTtJQUV2QixDQUFDO0lBRU8sZ0JBQWdCO0lBRXhCLENBQUM7Q0FFSjtBQXpLRCx3QkF5S0MiLCJmaWxlIjoicGFyc2VyL3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiJzcmMvIn0=
