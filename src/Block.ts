
/// <reference path="cocos2d.d.ts" />

module Breakout{

export class Block extends cc.Node{
	_health :number;

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
	}

	hit(){
		if( --this._health <= 0 )
			this.setVisible(false);
		else{
			if( 1 == this._health ){
				this.removeAllChildren(true);
				var sprite = cc.Sprite.create( "res/block_damaged.png" );
				this.addChild( sprite );
			}

			this.runAction( cc.Sequence.create(
				cc.ScaleTo.create( 0.03, 0.5 )
				, cc.ScaleTo.create( 0.03, 1 )
			));
		}
	}
}

}