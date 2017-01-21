
var MENU = 0;
var GAME = 1;

var state = GAME;

function main(){
	curTime = Date.now()-startTime;
	deltaTime = curTime-lastTime;

	update();
	render();

	lastTime = curTime;

	// request another frame to keeps the loop going
	requestAnimationFrame(main);
}

function init(){
	// initialize input managers
	mouse.init("#display canvas");
	gamepads.init();
	keys.init();
	keys.capture = [keys.LEFT,keys.RIGHT,keys.UP,keys.DOWN,keys.SPACE,keys.ENTER,keys.BACKSPACE,keys.ESCAPE,keys.W,keys.A,keys.S,keys.D,keys.P,keys.M];

	// setup screen filter
	screen_filter = new CustomFilter(PIXI.loader.resources.screen_shader.data);
	screen_filter.padding = 0;
	renderSprite.filterArea = new PIXI.Rectangle(0,0,size.x,size.y);

	//renderSprite.filters = [screen_filter];

	transition = 0;
	transitionDirection = 1;

	poolBounds = {
		width: size.x - size.x/14*2,
		height: size.y - size.y/4,
		x : size.x/14,
		y : size.y/7
	}

	//menu = new Menu();
	arena = new Arena();


	// setup resize
	window.onresize = onResize;
	onResize();

	// start the main loop
	main();
}

function onResize() {
	_resize();
	//screen_filter.uniforms["screen"] = [size.x,size.y];
	//screen_filter.uniforms["bufferSize"] = [nextPowerOfTwo(size.x),nextPowerOfTwo(size.y)];

	console.log("Resized",size,scaleMultiplier,[size.x*scaleMultiplier,size.y*scaleMultiplier]);
}

function update(){

	if( state === MENU ){
		menu.update();
	}else if( state === GAME ){
		arena.update();
	}else{

	}


	if(keys.isJustDown(keys.F)){
		fullscreen.toggleFullscreen();
	}if(keys.isJustDown(keys.M)){
		toggleMute();
	}
	
	// update input managers
	gamepads.update();
	keys.update();
	mouse.update();
}


function render(){

	if(state === MENU){
		menu.render();
	}else if(state === GAME){
		arena.render();
	}

	renderer.render(game,renderTexture);
	try{
		renderer.render(renderSprite,null,true,false);
	}catch(e){
		renderer.render(game,null,true,false);
		console.error(e);
	}
}


function getInput(_playerId){
	var res = {
		strokeLeft: false,
		strokeRight: false,
		dive: false,
		swap: false
	};

	// keyboard input
	var keyConfig = {
		strokeLeft: null,
		strokeRight: null,
		dive: null,
		swap: null
	};

	switch(_playerId){
		case 1:
		keyConfig.strokeLeft = keys.Q;
		keyConfig.strokeRight = keys.W;
		keyConfig.dive = keys.A;
		keyConfig.swap = keys.S;
		break;

		default:
		// no keyboard controls past first two players
	}

	if(keys.isJustDown(keyConfig.strokeLeft)){ res.strokeLeft = true};
	if(keys.isJustDown(keyConfig.strokeRight)){ res.strokeRight = true};
	if(keys.isJustDown(keyConfig.dive)){ res.dive = true};
	if(keys.isJustDown(keyConfig.swap)){ res.swap = true};

	/*
	// gamepad input
	if(gamepads.axisPast(gamepads.LSTICK_H, -0.5, -1, _playerId) || gamepads.isDown(gamepads.DPAD_LEFT, _playerId)){ res.x -= 1; }
	if(gamepads.axisPast(gamepads.LSTICK_H, 0.5, 1, _playerId) || gamepads.isDown(gamepads.DPAD_RIGHT, _playerId)){ res.x += 1; }
	if(gamepads.axisPast(gamepads.LSTICK_V, -0.5, -1, _playerId) || gamepads.isDown(gamepads.DPAD_UP, _playerId)){ res.y -= 1; }
	if(gamepads.axisPast(gamepads.LSTICK_V, 0.5, 1, _playerId) || gamepads.isDown(gamepads.DPAD_DOWN, _playerId)){ res.y += 1; }

	if(gamepads.isJustDown(gamepads.A, _playerId) || gamepads.isJustDown(gamepads.Y, _playerId) ){ res.jump = true; }
	if(gamepads.isJustDown(gamepads.X, _playerId) || gamepads.isJustDown(gamepads.B, _playerId) ){ res.shoot = true; }

	// clamp directional input (might be using both keyboard and controller)
	res.x = clamp(-1, res.x, 1);
	res.y = clamp(-1, res.y, 1);
	*/

	return res;
}
