
/// <reference path="cocos2d.d.ts" />
/// <reference path="Ball.ts" />
/// <reference path="Block.ts" />
/// <reference path="Util.ts" />

module Breakout{

class HelloWorld extends cc.Layer{
	FPS = 60; //※modify ../cocos2d.js
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
		var blockSize = cc.size( 38, 40 );
		var headerSize = cc.size( size.width, 20 );
		var paddingLeft = 8;
		var numBlocksPerLine = 8;

		this._blocks = [];
		for( var i = 0, len = numBlocksPerLine * 9; i < len; i++ ){
			var ix = i%numBlocksPerLine + 0.5;
			var iy = Math.floor(i/numBlocksPerLine) + 0.5;
			var block = Block.create();
			block.setPosition( cc.p(ix*blockSize.width + paddingLeft, size.height - headerSize.height - iy*blockSize.height) );
			this.addChild( block );

			this._blocks.push( block );
		}

		this._balls = [];
		for( var i = 0, len = 5; i < len; i++ ){
			var ball = Ball.create();
			ball.setPosition( cc.p(size.width*0.5, 50) );
			this.addChild( ball );

			this._balls.push( ball );
		}

		this._score = 0;
		var scoreLabel = cc.LabelTTF.create( "" );
		scoreLabel.setPosition( cc.p(size.width*0.5, size.height - headerSize.height) );
		this.addChild( this._scoreLabel = scoreLabel );

		this.setTouchEnabled(true);
		this.schedule( this.onUpdate, 1.0/this.FPS );

		return true;
	}

	onUpdate(){
		var gameClear = true;

		var objects = this._balls;
		var targets = this._blocks;

		LOOP:
		for( var i = 0, len = objects.length; i < len; i++ ){
			var o = objects[i];
			if( ! o )
				continue;

			o.onUpdate();
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
			this.unscheduleAllCallbacks();
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

export class HelloWorldScene extends cc.Scene {
	onEnter(){
		super.onEnter();

		var layer = new HelloWorld();
		layer.init();
		this.addChild( layer );
	}
}

}