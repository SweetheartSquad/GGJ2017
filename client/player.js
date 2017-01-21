
function Player(_id, _bounds){
    this.id = _id;
    this.container = new PIXI.Container();
    this.beanSprite = new PIXI.Sprite( PIXI.loader.resources.bean.texture );
    this.beanSprite.anchor.x = 0.5;
    this.beanSprite.anchor.y = 0.5;
    this.container.addChild( this.beanSprite );
    
	var laneSize = _bounds.y * 0.25;
    this.container.y = laneSize * this.id - ( size.y - _bounds.y ) * 0.5 + this.beanSprite.height * 0.5;
    this.container.x = this.beanSprite.width * 0.5 + size.x - _bounds.x;
}



Player.prototype.update = function(){
    
}



Player.prototype.draw = function(){

}   