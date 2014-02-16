/// <reference path="cocos2d.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Breakout;
(function (Breakout) {
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
    Breakout.Ball = Ball;
})(Breakout || (Breakout = {}));
//# sourceMappingURL=Ball.js.map
