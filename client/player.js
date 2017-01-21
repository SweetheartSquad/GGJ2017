

DEFAULT_SPEED = 2;

function Player( _id ){
    
    this.id = _id;
    this.container = new PIXI.Container();
    this.beanSprite = new PIXI.Sprite( PIXI.loader.resources.bean.texture );
    this.beanSprite.anchor.x = 0.5;
    this.beanSprite.anchor.y = 0.5;
    this.container.addChild( this.beanSprite );
    this.lastStroke = 0;

    var debug = new PIXI.Graphics();
    debug.beginFill(0xFF0000);
    debug.drawCircle(0,0,60);
    debug.endFill();
    this.container.addChild(debug);

	var laneSize = poolBounds.height * 0.25;
    this.container.y = poolBounds.y + laneSize * (this.id + 0.5);
    this.container.x = poolBounds.x + this.beanSprite.width * 0.5;

    this.speed = DEFAULT_SPEED;
    this.direction = 1;
}



Player.prototype.update = function(){
    
    var input = getInput( this.id );

    if( this.lastStroke !== -1 && input.strokeLeft ){
        this.speed += 0.5;
    }
    
    if( this.lastStroke !== 1 && input.strokeLeft ){
        this.speed += 0.5;
    }

    this.speed = lerp( this.speed, DEFAULT_SPEED, 0.025 );
    
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