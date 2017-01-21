

DEFAULT_SPEED = 2;
SPEED_RESET_FRAMES = 60;
NUM_LAPS = 5;

function Player( _id ){
    
    this.id = _id;
    this.lane = _id;
    this.lapsRemaining = NUM_LAPS;

    this.container = new PIXI.Container();
    this.swimmerSprite = new PIXI.Sprite( PIXI.loader.resources.swimmer.texture );
    this.swimmerSprite.anchor.x = 0.5;
    this.swimmerSprite.anchor.y = 0.5;
    this.swimmerSprite.width = size.x/5;
    this.swimmerSprite.scale.y = this.swimmerSprite.scale.x;
    this.container.addChild( this.swimmerSprite );
    this.nextStroke = 0;
    this.framesSinceCorrectStroke = 0;
    
    this.willDive = false;
    this.willSwap = false;
    this.canQueue = false;

    this.hasBean = false;

    this.canPass = {};

    this.queueTimeout = 0;

    var debug = new PIXI.Graphics();
    debug.beginFill(0xFF0000);
    debug.drawCircle(0,0,60);
    debug.endFill();
    this.container.addChild(debug);

    this.container.x = poolBounds.x + this.swimmerSprite.width * 0.5;

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

    this.queueTimeout--;

    this.framesSinceCorrectStroke++;

    if( (this.nextStroke === 0 || this.nextStroke === -1) && input.strokeLeft ){
        this.nextStroke = 1;
        this.correctStroke();
    }
    
    if( (this.nextStroke === 0 || this.nextStroke === 1) && input.strokeRight ){
        this.nextStroke = -1;
        this.correctStroke();
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
    	( this.container.x + this.swimmerSprite.width/2 >= poolBounds.width + poolBounds.x )
    	||
        ( this.container.x - this.swimmerSprite.width/2 <= poolBounds.x )
    ){
        this.direction = -this.direction;
        this.lapsRemaining -= 1;
        this.swimmerSprite.scale.x *= -1;
    }
    
    this.container.y = poolBounds.y + laneSize * (this.lane + 0.5);


    if( this.hasBean ){
        this.beanSprite.scale.x = 0.5;
    }else{
        this.beanSprite.scale.x = 1.0;
    }
}


Player.prototype.executeQueued = function(){
    if( this.willSwap === true ){
        this.swap();
    }
    if( this.willDive === true ){
        this.dive();
    }
    this.queueTimeout = 0;
}

Player.prototype.correctStroke = function(){
    this.speed += 0.5;
    this.framesSinceCorrectStroke = 0;
    this.swimmerSprite.scale.y *= -1;
}


Player.prototype.pass = function( player ){
    var key = String(player.id);
    if( !this.canPass.hasOwnProperty(key) 
        || this.canPass[key] === true ){
       console.log(this.id,"passing", player.id);
       this.canPass[key] = false;
       return true;
    }
    return false;
}


Player.prototype.notifyPositions = function( players ){
    for ( var i = 0; i < players.length; i++ ){
        var key = String(players[i].id);
        if ( !this.canPass.hasOwnProperty(key) 
            || ( !this.canPass[key] && Math.abs( players[i].container.x - this. container.x ) > 100 )){
            this.canPass[key] = true;
        }
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