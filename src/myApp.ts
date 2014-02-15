
/// <reference path="cocos2d.d.ts" />

class Ball extends cc.Node{
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
		var speed = 5;
		this.setVelocity( angle, speed );

		this._speed = speed;
		this._areaSize = cc.Director.getInstance().getWinSize();
	}

	update( dt :number ){
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

class Block extends cc.Node{
	_health :number;

	_healthLabel :cc.LabelTTF;

	static create(){
		var self = new Block();
		self.init();
		return self;
	}

	init(){
		var sprite = cc.Sprite.create( "res/block.png" );
		this.addChild( sprite );
		this.setContentSize( sprite.getContentSize() );

		this._health = Math.floor(Math.random()*3) + 1;

		var healthLabel = cc.LabelTTF.create( "" + this._health );
		this.addChild( this._healthLabel = healthLabel );
	}

	hit(){
		if( --this._health <= 0 )
			this.setVisible(false);
		else
			this._healthLabel.setString("" + this._health);
	}
}

class Util {
	static hitTestPoint( node :cc.Node, targetPoint :cc.Point ){
		var p = node.getPosition();
		var size = node.getContentSize();

		var left = p.x - size.width * 0.5;
		var right = p.x + size.width * 0.5;
		var top = p.y + size.height * 0.5;
		var bottom = p.y - size.height * 0.5;

		if( left < targetPoint.x && targetPoint.x < right ){
			if( bottom < targetPoint.y && targetPoint.y < top )
				return true;
		}

		return false;
	}
}

class HelloWorld extends cc.Layer{
	BASE_SCORE = 100;

	_blocks :Array<Block>;
	_balls :Array<Ball>;

	_score :number;
	_scoreLabel :cc.LabelTTF;

	_touchPoint :cc.Point;

	_numBrokens :number = 0;

	init(){
		super.init();

		var size = cc.Director.getInstance().getWinSize();

		this._blocks = [];
		for( var i = 0, len = 72; i < len; i++ ){
			var ix = i%8 + 0.5;
			var iy = Math.floor(i/8) + 0.5;
			var block = Block.create();
			block.setPosition( cc.p(ix*40, size.height - 20-iy*40) );
			this.addChild( block );

			this._blocks.push( block );
		}

		this._balls = [];
		for( var i = 0, len = 5; i < len; i++ ){
			var ball = Ball.create();
			ball.setPosition( cc.p(160,50) );
			this.addChild( ball );

			this._balls.push( ball );
		}

		this._score = 0;
		var scoreLabel = cc.LabelTTF.create( "" );
		scoreLabel.setPosition( cc.p(size.width*0.5, size.height - 20) );
		this.addChild( this._scoreLabel = scoreLabel );

		this.setTouchEnabled(true);
		this.scheduleUpdate();

		return true;
	}

	update( dt :number ){
		var gameClear = true;

		var objects = this._balls;
		var targets = this._blocks;

		LOOP:
		for( var i = 0, len = objects.length; i < len; i++ ){
			var o = objects[i];
			o.update(dt);

			if( o.isHitWall() )
				this._numBrokens = 0;

			for( var k = targets.length-1; k >= 0; k-- ){
				var target = targets[k];
				if( ! target.isVisible() )
					continue;

				gameClear = false;

				if( Util.hitTestPoint( o, target.getPosition()) ){
					target.hit();
					o.bounce( target.getPosition() );

					if( ! target.isVisible() ){
						this._numBrokens++;
						this._score += this.BASE_SCORE * this._numBrokens;
						this._scoreLabel.setString( "" + this._score );
					}

					break LOOP;
				}
			}

			var touchPoint = this._touchPoint;
			if( touchPoint ){
				if( Util.hitTestPoint( o, touchPoint ) ){
					o.bounce( touchPoint );
					break;
				}
			}
		}

		if( gameClear ){
			this.unscheduleUpdate();
			this.removeAllChildren(true);

			alert( "GAME CLEAR!!" );
			this.init();
		}
	}

	onTouchesBegan(touches, event){
		var p = touches[0]._point;
		this._touchPoint = p;
	}

	onTouchesMoved(touches, event){
		var p = touches[0]._point;
		this._touchPoint = p;
	}

	onTouchesEnded(touches, event){
		this._touchPoint = null;
	}
}

class HelloWorldScene extends cc.Scene {
	onEnter(){
		super.onEnter();

		var layer = new HelloWorld();
		layer.init();
		this.addChild( layer );
	}
}