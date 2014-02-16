
/// <reference path="cocos2d.d.ts" />

module Breakout{

export class Ball extends cc.Node{
	_areaSize :cc.Size;

	_radius :number;

	_vx :number;
	_vy :number;
	_speed :number;

	_isHitWall :Boolean;

	static create(){
		var self = new Ball();
		self.init();
		return self;
	}

	init(){
		var sprite = cc.Sprite.create( "res/ball.png" );
		this.addChild( sprite );
		this.setContentSize( sprite.getContentSize() );

		this._radius = sprite.getContentSize().width * 0.5;

		var angle = Math.floor(Math.random()*360);
		var speed = 8;
		this.setVelocity( angle, speed );

		this._speed = speed;
		this._areaSize = cc.Director.getInstance().getWinSize();
	}

	onUpdate(){
		var p = this.getPosition();
		p.x += this._vx;
		p.y += this._vy;

		this._isHitWall = false;

		var right = this._areaSize.width - this._radius;
		var left = this._radius;
		if( right < p.x ){
			this._isHitWall = true;
			this._vx *= -1;
			p.x = right;
		}
		else if( p.x < left){
			this._isHitWall = true;
			this._vx *= -1;
			p.x = left;
		}

		var top = this._areaSize.height - this._radius;
		var bottom = this._radius;
		if( top < p.y ){
			this._isHitWall = true;
			this._vy *= -1;
			p.y = top;
		}
		else if( p.y < bottom ){
			this._isHitWall = true;
			this._vy *= -1;
			p.y = bottom;
		}

		this.setPosition( p );
	}

	isHitWall(){
		return this._isHitWall;
	}

	setVelocity( angle :number, speed :number ){
		this._vx = speed * Math.cos(angle);
		this._vy = speed * Math.sin(angle);
	}

	bounce( targetPoint :cc.Point ){
		var p = this.getPosition();
		var dx = p.x - targetPoint.x;
		var dy = p.y - targetPoint.y;

		var angle = Math.atan2( dy, dx );
		this.setVelocity( angle, this._speed );
	}
}

}