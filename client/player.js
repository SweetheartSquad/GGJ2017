
function Player( _id ){
    this.id = _id;
    this.container = new PIXI.Container();
    this.beanSprite = new PIXI.Sprite( PIXI.loader.resources.bean.texture );
    this.beanSprite.anchor.x = 0.5;
    this.beanSprite.anchor.y = 0.5;
    this.container.addChild( this.beanSprite );

	var laneSize = poolBounds.height * 0.25;
    this.container.y = laneSize * this.id;
    this.container.x = poolBounds.x + this.beanSprite.width * 0.5;

    this.speed = 5;
    this.direction = 1;
}



Player.prototype.update = function(){
    this.container.x += this.speed * this.direction;
    if( this.container.x + this.beanSprite.width >= poolBounds.width + poolBounds.x ){
        this.direction = -1;
    }
    if( this.container.x - this.beanSprite.width <= poolBounds.x ){
        this.direction = 1;
    }
}



Player.prototype.draw = function(){

}   