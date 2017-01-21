

DEFAULT_SPEED = 2;
<<<<<<< HEAD
SPEED_RESET_FRAMES = 60;
=======
NUM_LAPS = 5;
>>>>>>> 5d6c9d4dbdb02245559ed2f1a27da9d7446af269

function Player( _id ){
    
    this.id = _id;
    this.lane = _id;
    this.lapsRemaining = NUM_LAPS;

    this.container = new PIXI.Container();
    this.beanSprite = new PIXI.Sprite( PIXI.loader.resources.bean.texture );
    this.beanSprite.anchor.x = 0.5;
    this.beanSprite.anchor.y = 0.5;
    this.container.addChild( this.beanSprite );
    this.nextStroke = 0;
    this.framesSinceCorrectStroke = 0;
    
    this.willDive = false;
    this.willSwap = false;
    this.canQueue = false;

    this.canPass = {};

    this.queueTimeout = 0;

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

    if( this.queueTimeout <= 0 ){
        this.willDive = false;
        this.willSwap = false;
    } 


    if( input.dive == true ){
        this.willDive = true;
        this.queueTimeout = 60;
    }

    
    if( input.swap == true ){
        this.willSwap = true;
        this.queueTimeout = 60;
    }

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
    
    if(
    	( this.container.x + this.beanSprite.width/2 >= poolBounds.width + poolBounds.x )
    	||
        ( this.container.x - this.beanSprite.width/2 <= poolBounds.x )
    ){
        this.direction = -this.direction;
        this.lapsRemaining -= 1;
    }
    
    this.container.y = poolBounds.y + laneSize * (this.lane + 0.5);
}


Player.prototype.executeQueued = function(){
    if( this.willSwap === true ){
        this.swap();
    }
    if( this.willDive === true ){
        this.dive();
    }

}


Player.prototype.pass = function( player ){
    var canPass = false;
    var key = String(player.id);
    if( !this.passHistroy.hasOwnProperty(key)){
        if( Math.abs(this.passHistroy[key] - this.container.x ) > 500 ){
            canPass = true;
        }
    }else{
        console.log("ASDsadsad");
        canPass = true;
    }
    if( canPass ){
        console.log(this.id,"passing", player.id);
        this.passHistroy[key] = this.container.x;
        // Do stuff
    }
}


Player.prototype.dive = function(){
    this.willDive = false;
}


Player.prototype.swap = function(){
    this.willSwap = false;
}


Player.prototype.draw = function(){

}   