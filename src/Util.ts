
/// <reference path="cocos2d.d.ts" />

module Breakout{

export class Util {
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

}
