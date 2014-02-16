/// <reference path="cocos2d.d.ts" />
var Breakout;
(function (Breakout) {
    var Util = (function () {
        function Util() {
        }
        Util.hitTestPoint = function (node, targetPoint) {
            var p = node.getPosition();
            var size = node.getContentSize();

            var left = p.x - size.width * 0.5;
            var right = p.x + size.width * 0.5;
            var top = p.y + size.height * 0.5;
            var bottom = p.y - size.height * 0.5;

            if (left < targetPoint.x && targetPoint.x < right) {
                if (bottom < targetPoint.y && targetPoint.y < top)
                    return true;
            }

            return false;
        };
        return Util;
    })();
    Breakout.Util = Util;
})(Breakout || (Breakout = {}));
//# sourceMappingURL=Util.js.map
