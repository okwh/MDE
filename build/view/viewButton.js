"use strict";
const util_1 = require("../util");
class ButtonView extends util_1.DomHelper.AppendableDomWrapper {
    constructor(width, height) {
        super("div", "mde-button");
        this._width = -1;
        this._hover = false;
        this._dom.style.display = "inline-block";
        this._dom.style.cursor = "pointer";
        this._dom.style.overflow = "hidden";
        this._container = util_1.DomHelper.elem("div", "mde-button-container");
        this._dom.appendChild(this._container);
        this._container.style.display = "flex";
        this._container.style.justifyContent = "center";
        this._container.style.alignItems = "center";
        this._container.setAttribute("title", "tooltip");
        this.width = width;
        this.height = height;
    }
    setText(content) {
        let span = util_1.DomHelper.elem("span", "mde-button-content");
        span.innerHTML = content;
        this.setContent(span);
    }
    setContent(elem) {
        if (this._container.children.length > 0) {
            this._container.firstElementChild.remove();
        }
        this._container.appendChild(elem);
    }
    setContentFromOption(option) {
        if (option.spanClass) {
            let span = util_1.DomHelper.elem("span", option.spanClass);
            this.setContent(span);
            if (option.text) {
                this.setTooltip(option.text);
            }
        }
        else if (option.icon) {
            this.setIcon(option.icon);
            if (option.text) {
                this.setTooltip(option.text);
            }
        }
        else if (option.text) {
            this.setText(option.text);
        }
        else {
            this.setText(option.name);
        }
    }
    setIcon(content) {
        if (this._container.children.length > 0) {
            this._container.firstElementChild.remove();
        }
        let i = util_1.DomHelper.elem("i", content);
        this._container.appendChild(i);
    }
    setTooltip(content) {
        this._container.setAttribute("title", content);
    }
    get spanContent() {
        if (this._container.children.length > 0) {
            return this._container.firstElementChild;
        }
        throw new Error("There no span content.");
    }
    get background() {
        return this._dom.style.background;
    }
    set background(content) {
        this._dom.style.background = content;
    }
    get height() {
        return this._height;
    }
    set height(h) {
        if (h !== this._height) {
            this._height = h;
            if (h < 0)
                this._container.style.height = "";
            else
                this._container.style.height = h + "px";
        }
    }
    get active() {
        return this._isActive;
    }
    set active(v) {
        if (v !== this._isActive) {
            this._isActive = v;
            if (v) {
                this._dom.classList.add("active");
            }
            else {
                this._dom.classList.remove("active");
            }
        }
    }
    get width() {
        return this._width;
    }
    set width(w) {
        if (w !== this._width) {
            this._width = w;
            if (w < 0)
                this._container.style.width = "";
            else
                this._container.style.width = w + "px";
        }
    }
    dispose() {
    }
}
exports.ButtonView = ButtonView;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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UUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBRUQsSUFBSSxLQUFLLENBQUMsQ0FBVTtRQUNoQixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFFaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ3JDLElBQUk7Z0JBQ0EsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDL0MsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPO0lBQ1AsQ0FBQztDQUVKO0FBNUlELGdDQTRJQyIsImZpbGUiOiJ2aWV3L3ZpZXdCdXR0b24uanMiLCJzb3VyY2VSb290Ijoic3JjLyJ9
