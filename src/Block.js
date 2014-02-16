/// <reference path="cocos2d.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Breakout;
(function (Breakout) {
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block() {
            _super.apply(this, arguments);
        }
        Block.create = function () {
            var self = new Block();
            self.init();
            return self;
        };

        Block.prototype.init = function () {
            var sprite = cc.Sprite.create("res/block.png");
            this.addChild(sprite);
            this.setContentSize(sprite.getContentSize());

            this._health = Math.floor(Math.random() * 3) + 1;
        };

        Block.prototype.hit = function () {
            if (--this._health <= 0)
                this.setVisible(false);
            else {
                if (1 == this._health) {
                    this.removeAllChildren(true);
                    var sprite = cc.Sprite.create("res/block_damaged.png");
                    this.addChild(sprite);
                }

                this.runAction(cc.Sequence.create(cc.ScaleTo.create(0.03, 0.5), cc.ScaleTo.create(0.03, 1)));
            }
        };
        return Block;
    })(cc.Node);
    Breakout.Block = Block;
})(Breakout || (Breakout = {}));
//# sourceMappingURL=Block.js.map
