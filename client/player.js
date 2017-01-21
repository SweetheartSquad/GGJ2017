

DEFAULT_SPEED = 2;
SPEED_RESET_FRAMES = 60;

function Player( _id ){
    
    this.id = _id;
    this.lane = _id;
    this.container = new PIXI.Container();
    this.beanSprite = new PIXI.Sprite( PIXI.loader.resources.bean.texture );
    this.beanSprite.anchor.x = 0.5;
    this.beanSprite.anchor.y = 0.5;
    this.container.addChild( this.beanSprite );
    this.nextStroke = 0;
    this.framesSinceCorrectStroke = 0;

    var debug = new PIXI.Graphics();
    debug.beginFill(0xFF0000);
    debug.drawCircle(0,0,60);
    debug.endFill();
    this.container.addChild(debug);

    this.container.x = poolBounds.x + this.beanSprite.width * 0.5;

    this.speed = DEFAULT_SPEED;
    this.direction = 1;
}



Player.prototype.update = function(){
	var laneSize = poolBounds.height * 0.25;
	
    this.lastX = this.container.x;

    var input = getInput( this.id );

    this.framesSinceCorrectStroke++;

    if( (this.nextStroke === 0 || this.nextStroke === -1) && input.strokeLeft ){
        this.speed += 0.5;
        this.nextStroke = 1;
        this.framesSinceCorrectStroke = 0;
    }
    
    if( (this.nextStroke === 0 || this.nextStroke === 1) && input.strokeRight ){
        this.speed += 0.5;
        this.nextStroke = -1;
        this.framesSinceCorrectStroke = 0;
    }

    if( this.nextStroke === 1 && input.strokeLeft ){
        this.speed -= 0.25;
    }

    
    if( this.nextStroke === -1 && input.strokeRight ){
        this.speed -= 0.25;
    }

    if( this.framesSinceCorrectStroke >= SPEED_RESET_FRAMES ){
        this.framesSinceCorrectStroke = 0;
        this.nextStroke = 0;
    }

    this.speed = lerp( this.speed, DEFAULT_SPEED, 0.025 );
    
    this.container.x += this.speed * this.direction;
    
    if( this.container.x + this.beanSprite.width/2 >= poolBounds.width + poolBounds.x ){
        this.direction = -1;
    }
    if( this.container.x - this.beanSprite.width/2 <= poolBounds.x ){
        this.direction = 1;
    }

    this.container.y = poolBounds.y + laneSize * (this.lane + 0.5);
}



Player.prototype.draw = function(){

}   