/// <reference path="cocos2d.d.ts" />
/// <reference path="Ball.ts" />
/// <reference path="Block.ts" />
/// <reference path="Util.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Breakout;
(function (Breakout) {
    var HelloWorld = (function (_super) {
        __extends(HelloWorld, _super);
        function HelloWorld() {
            _super.apply(this, arguments);
            this.FPS = 30;
            this.BASE_SCORE = 100;
            this._numBrokens = 0;
        }
        HelloWorld.prototype.init = function () {
            _super.prototype.init.call(this);

            var size = cc.Director.getInstance().getWinSize();
            var blockSize = cc.size(38, 40);
            var headerSize = cc.size(size.width, 20);
            var paddingLeft = 8;
            var numBlocksPerLine = 8;

            this._blocks = [];
            for (var i = 0, len = numBlocksPerLine * 9; i < len; i++) {
                var ix = i % numBlocksPerLine + 0.5;
                var iy = Math.floor(i / numBlocksPerLine) + 0.5;
                var block = Breakout.Block.create();
                block.setPosition(cc.p(ix * blockSize.width + paddingLeft, size.height - headerSize.height - iy * blockSize.height));
                this.addChild(block);

                this._blocks.push(block);
            }

            this._balls = [];
            for (var i = 0, len = 5; i < len; i++) {
                var ball = Breakout.Ball.create();
                ball.setPosition(cc.p(size.width * 0.5, 50));
                this.addChild(ball);

                this._balls.push(ball);
            }

            this._score = 0;
            var scoreLabel = cc.LabelTTF.create("");
            scoreLabel.setPosition(cc.p(size.width * 0.5, size.height - headerSize.height));
            this.addChild(this._scoreLabel = scoreLabel);

            this.setTouchEnabled(true);
            this.schedule(this.onUpdate, 1.0 / this.FPS);

            return true;
        };

        HelloWorld.prototype.onUpdate = function () {
            var gameClear = true;

            var objects = this._balls;
            var targets = this._blocks;

            LOOP:
            for (var i = 0, len = objects.length; i < len; i++) {
                var o = objects[i];
                if (!o)
                    continue;

                o.onUpdate();
                if (o.isHitWall())
                    this._numBrokens = 0;

                for (var k = targets.length - 1; k >= 0; k--) {
                    var target = targets[k];
                    if (!target.isVisible())
                        continue;

                    gameClear = false;

                    if (Breakout.Util.hitTestPoint(o, target.getPosition())) {
                        target.hit();
                        o.bounce(target.getPosition());

                        if (!target.isVisible()) {
                            this._numBrokens++;
                            this._score += this.BASE_SCORE * this._numBrokens;
                            this._scoreLabel.setString("" + this._score);
                        }

                        break LOOP;
                    }
                }

                var touchPoint = this._touchPoint;
                if (touchPoint) {
                    if (Breakout.Util.hitTestPoint(o, touchPoint)) {
                        o.bounce(touchPoint);
                        break;
                    }
                }
            }

            if (gameClear) {
                this.unscheduleAllCallbacks();
                this.removeAllChildren(true);

                alert("GAME CLEAR!!");
                this.init();
            }
        };

        HelloWorld.prototype.onTouchesBegan = function (touches, event) {
            var p = touches[0]._point;
            this._touchPoint = p;
        };

        HelloWorld.prototype.onTouchesMoved = function (touches, event) {
            var p = touches[0]._point;
            this._touchPoint = p;
        };

        HelloWorld.prototype.onTouchesEnded = function (touches, event) {
            this._touchPoint = null;
        };
        return HelloWorld;
    })(cc.Layer);

    var HelloWorldScene = (function (_super) {
        __extends(HelloWorldScene, _super);
        function HelloWorldScene() {
            _super.apply(this, arguments);
        }
        HelloWorldScene.prototype.onEnter = function () {
            _super.prototype.onEnter.call(this);

            var layer = new HelloWorld();
            layer.init();
            this.addChild(layer);
        };
        return HelloWorldScene;
    })(cc.Scene);
    Breakout.HelloWorldScene = HelloWorldScene;
})(Breakout || (Breakout = {}));
//# sourceMappingURL=myApp.js.map
