
function Player(_id){
    this.id = _id;
    this.container = new PIXI.Container();
    this.beanSprite = new PIXI.Sprite( PIXI.loader.resources.bean.texture );
    this.container.addChild( this.beanSprite );
}



Player.prototype.update = function(){
    
}



Player.prototype.draw = function(){

}