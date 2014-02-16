/// <reference path="cocos2d.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball() {
        _super.apply(this, arguments);
    }
    Ball.create = function () {
        var self = new Ball();
        self.init();
        return self;
    };

    Ball.prototype.init = function () {
        var sprite = cc.Sprite.create("res/ball.png");
        this.addChild(sprite);
        this.setContentSize(sprite.getContentSize());

        this._radius = sprite.getContentSize().width * 0.5;

        var angle = Math.floor(Math.random() * 360);
        var speed = 8;
        this.setVelocity(angle, speed);

        this._speed = speed;
        this._areaSize = cc.Director.getInstance().getWinSize();
    };

    Ball.prototype.onUpdate = function () {
        var p = this.getPosition();
        p.x += this._vx;
        p.y += this._vy;

        this._isHitWall = false;

        var right = this._areaSize.width - this._radius;
        var left = this._radius;
        if (right < p.x) {
            this._isHitWall = true;
            this._vx *= -1;
            p.x = right;
        } else if (p.x < left) {
            this._isHitWall = true;
            this._vx *= -1;
            p.x = left;
        }

        var top = this._areaSize.height - this._radius;
        var bottom = this._radius;
        if (top < p.y) {
            this._isHitWall = true;
            this._vy *= -1;
            p.y = top;
        } else if (p.y < bottom) {
            this._isHitWall = true;
            this._vy *= -1;
            p.y = bottom;
        }

        this.setPosition(p);
    };

    Ball.prototype.isHitWall = function () {
        return this._isHitWall;
    };

    Ball.prototype.setVelocity = function (angle, speed) {
        this._vx = speed * Math.cos(angle);
        this._vy = speed * Math.sin(angle);
    };

    Ball.prototype.bounce = function (targetPoint) {
        var p = this.getPosition();
        var dx = p.x - targetPoint.x;
        var dy = p.y - targetPoint.y;

        var angle = Math.atan2(dy, dx);
        this.setVelocity(angle, this._speed);
    };
    return Ball;
})(cc.Node);

var Block = (function (_super) {
    __extends(Block, _super);
    function Block() {
        _super.apply(this, arguments);
    }
    //_healthLabel :cc.LabelTTF;
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
        //var healthLabel = cc.LabelTTF.create( "" + this._health );
        //this.addChild( this._healthLabel = healthLabel );
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
            var block = Block.create();
            block.setPosition(cc.p(ix * blockSize.width + paddingLeft, size.height - headerSize.height - iy * blockSize.height));
            this.addChild(block);

            this._blocks.push(block);
        }

        this._balls = [];
        for (var i = 0, len = 5; i < len; i++) {
            var ball = Ball.create();
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

                if (Util.hitTestPoint(o, target.getPosition())) {
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
                if (Util.hitTestPoint(o, touchPoint)) {
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
//# sourceMappingURL=myApp.js.map
