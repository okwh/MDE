"use strict";
const util_1 = require("../util");
class SplitterView extends util_1.DomHelper.FixedElement {
    constructor(width = -1) {
        super("div", "mde-splitter");
        width = width >= 0 ? width : SplitterView.DefaultWidth;
        this.width = width;
    }
    dispose() {
    }
}
SplitterView.DefaultWidth = 4;
exports.SplitterView = SplitterView;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy92aWV3L3ZpZXdTcGxpdHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsa0NBQThDO0FBTTlDLGtCQUEwQixTQUFRLGdCQUFTLENBQUMsWUFBWTtJQUlwRCxZQUFZLFFBQWdCLENBQUMsQ0FBQztRQUMxQixLQUFLLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRTdCLEtBQUssR0FBRyxLQUFLLElBQUksQ0FBQyxHQUFHLEtBQUssR0FBRyxZQUFZLENBQUMsWUFBWSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxPQUFPO0lBQ1AsQ0FBQzs7QUFWc0IseUJBQVksR0FBRyxDQUFDLENBQUM7QUFGNUMsb0NBY0MiLCJmaWxlIjoidmlldy92aWV3U3BsaXR0ZXIuanMiLCJzb3VyY2VSb290Ijoic3JjLyJ9
