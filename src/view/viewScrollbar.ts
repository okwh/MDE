import {DomWrapper, IDisposable} from "../util"

class ScrollBarTrain extends DomWrapper.AbsoluteElement implements IDisposable {

    constructor() {
        super("div", "mde-scrollbar-train");

        this.right = 0;
    }

    dispose() {
    }

}

export class TrainMoveEvent extends Event {
    private _percentage : number;

    constructor(_per) {
        super("trainMove");
        this._percentage = _per;
    }

    get percentage() {
        return this._percentage;
    }

}

/** 
 * ## Scrollbar view
 * 
 * set the height of scrollbar,
 * but do **not** set the fixed width in the code
 */
export class ScrollBarView 
    extends DomWrapper.AbsoluteElement implements IDisposable {

    public static readonly DefaultScrollAlpha = 0.01;

    private _train: ScrollBarTrain;
    private _mouseMove : EventListener = null;
    private _mouseUp : EventListener = null;

    private _fadeOut : boolean;
    private _fadeOutTime : number;
    private _exciteCount : number;

    constructor(fadeOut = true, fadeOutTime = 2000) {
        super("div", "mde-scrollbar mde-box");

        this._fadeOut = fadeOut;
        this._fadeOutTime = fadeOutTime;
        this._exciteCount = 0;

        this._train = new ScrollBarTrain();
        this._train.appendTo(this._dom);

        let clickOffset: number = 0;
        let mouseMove = (evt: MouseEvent) => {
            let rect = this._dom.getBoundingClientRect(),
                trainTop = evt.clientY - clickOffset - rect.top,
                percentage = trainTop / (this.height - this._train.height);

            if (percentage < ScrollBarView.DefaultScrollAlpha) {
                percentage = 0;
            } else if (percentage > (1 - ScrollBarView.DefaultScrollAlpha)) {
                percentage = 1;
            }

            if (percentage >= 0 && percentage <= 1) {
                this.trainPositionPercentage = percentage;

                let event = new TrainMoveEvent(percentage);
                this._dom.dispatchEvent(event);
            }
        }

        this._train.on("mousedown", (evt: MouseEvent) => {
            evt.preventDefault();
            window.addEventListener("mousemove", mouseMove, true);
            this._mouseMove = mouseMove;

            clickOffset = evt.offsetY;
        });

        this._mouseUp = (evt: MouseEvent) => {
            window.removeEventListener("mousemove", mouseMove, true);
            this._mouseMove = null;
        }

        window.addEventListener("mouseup", this._mouseUp, true);

    }

    /**
     * The scrollbar will fade out automatically,
     * call `excite` to display it again.
     * @param presist the scrollbar will not fade out
     */
    excite(presist: boolean = false) {
        if (this._fadeOut) {
            this._exciteCount++;

            this._train.element().classList.remove("mde-scrollbar-train-fadeOut");

            setTimeout(() => {
                this._exciteCount--;

                if (this._exciteCount === 0 && !presist) {
                    this._train.element().classList.add("mde-scrollbar-train-fadeOut");
                }
            }, this._fadeOutTime);
        }
    }

    set trainHeight(h: number) {
        this._train.height = h;
    }

    set trainHeightPercentage(hp: number) {
        hp = Math.floor(hp * 100) / 100;
        if (hp < 0 || hp > 1)
            throw new Error("Data should be between 0 and 1: " + hp);
        this._train.height = this.height * hp;
    }

    set trainTop(h: number) {
        this.excite();
        this._train.top = h;
    }

    /**
     * set the percentage of height, 
     * the value will be limit between 0 and 1.
     */
    set trainPositionPercentage(per: number) {
        this.excite();
        // per = Math.floor(per * 10000) / 10000;
        if (per < 0) per = 0;
        else if (per > 1) per = 1;

        this._train.top = (this.height - this._train.height) * per;
    }

    set width(w : number) {
        throw new Error("Do not try to set width of scrollbar, set it in css.");
    }

    get width() {
        return super.width;
    }

    set height(h: number) {
        let oldTrainHeightPercentage = this._train.height / this.height,
            oldTrainTopPercentage = this._train.top / (this.height - this._train.height);

        super.height = h;
        if (this.height > 0 && this._train.height > 0 && (this.height - this._train.height) > 0) {

            this.trainHeightPercentage = oldTrainHeightPercentage;
            this.trainPositionPercentage = oldTrainTopPercentage;
        }
    }

    get height() {
        return super.height;
    }

    dispose() {
        this._train.dispose();
        if (this._mouseMove !== null) {
            window.removeEventListener("mousemove", this._mouseMove, true);
        }
        window.removeEventListener("mouseup", this._mouseUp, true);
    }

}
