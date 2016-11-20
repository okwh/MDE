export {DocumentView} from "./viewDocument"
export {LineView} from "./viewLine"
export {WordView} from "./viewWord"
export {CursorView} from "./viewCursor"
export {EditorView} from "./viewEditor"
export {InputerView} from "./viewInputer"

export interface IVirtualNode {
    render(): Node;
}

export interface IVirtualElement {
    render(): HTMLElement;
}

export interface Coordinate {
    x: number;
    y: number;
}

export class MarkdownLexerState {

    private _inBlob: boolean;
    private _inTag: boolean;
    private _prefixIndent: string;

    constructor() {

    }

    clone() : MarkdownLexerState {
        let state = new MarkdownLexerState();
        state._inBlob = this._inBlob;
        state._inTag = this._inTag;
        state._prefixIndent = this._prefixIndent;
        return state;
    }

    get inBlob() {
        return this._inBlob;
    }

    set inBlob(_t: boolean) {
        this._inBlob = _t;
    }

    get inTag() {
        return this._inTag;
    }

    set inTag(_t: boolean) {
        this._inTag = _t;
    }

    get prefixIndent() {
        return this._prefixIndent;
    }

    set prefixIndent(_p: string) {
        this._prefixIndent = _p;
    }

}