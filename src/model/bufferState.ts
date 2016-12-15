import {TextModel, TextEditEvent} from "./textModel"
import {EventEmitter} from "events"
import {Host, IDisposable} from "../util"
import * as Path from "path"

export class BufferStateChanged extends Event {

    private _buffer_state_changed: boolean;

    constructor(fileStateChanged: boolean) {
        super("bufferStateChanged");

        this._buffer_state_changed = fileStateChanged;
    }

    get bufferStateChanged() {
        return this._buffer_state_changed;
    }

}

///
/// A file state
///
export class BufferState extends EventEmitter implements IDisposable {

    private _abs_path: string;
    private _filename: string = null;
    private _is_modified: boolean;
    private _text_model: TextModel = null;

    private _textModelChangedHandler: Function;

    constructor(absPath?: string) {
        super();

        this._abs_path = absPath;

        this._textModelChangedHandler = (evt: TextEditEvent) => {
            if (!this._is_modified) {
                this._is_modified = true;

                let evt = new BufferStateChanged(true);
                this.emit("bufferStateChanged", evt);
            }
        };

        if (!this._abs_path) {
            this.initTextModel("")
            this._is_modified = true;

            setTimeout(() => {
                let evt = new BufferStateChanged(true);
                this.emit("bufferStateChanged", evt);
            }, 10);
        }
    }

    private initTextModel(content: string) {
        this._text_model = new TextModel(content);
        this._text_model.on("textEdit", this._textModelChangedHandler);
    }

    async readFileContentToModel(encoding: string = "utf8"): Promise<boolean> {
        if (this._text_model === null) {
            let content = await Host.readFile(this._abs_path, encoding);
            this.initTextModel(content);
            return true;
        }
        return false;
    }

    async writeContentToFile(path: string, encoding: string = "utf8"): Promise<boolean> {
        if (this._text_model) {
            let content = this._text_model.reportAll();

            let result = await Host.writeStringToFile(path, "utf8", content);
            if (result) {
                this._is_modified = false;
                let evt = new BufferStateChanged(false);
                this.emit("bufferStateChanged", evt);
                return true;
            }
        }
        return false;
    }

    private detachTextModel() {
        if (this._text_model) {
            this._text_model.removeListener("textEdit", this._textModelChangedHandler);
            this._text_model = null;
        }
    }

    dispose() {
        this.detachTextModel();
    }

    set absolutePath(path: string) {
        if (this._abs_path && this._abs_path != path) {
            this.detachTextModel();
        }
        this._abs_path = path;
    }

    get absolutePath() {
        return this._abs_path;
    }

    get filename() {
        if (!this._abs_path) return "untitled";
        if (!this._filename)
            this._filename = Path.basename(this._abs_path);
        return this._filename;
    }

    get isModified() {
        return this._is_modified;
    }

    get model() {
        return this._text_model;
    }

}
