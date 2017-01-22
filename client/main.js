
var SPLASH = -1;
var MENU = 0;
var GAME = 1;
var BEAN = 2;
var WIN  = 3;

var state = SPLASH;

debug = false;

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
	shaderAmount = 1;
	renderSprite.filterArea = new PIXI.Rectangle(0,0,size.x,size.y);

	renderSprite.filters = [screen_filter];

	transition = 1;

	poolBounds = {
		width: size.x - size.x/14*2,
		height: size.y - size.y/4,
		x : size.x/14,
		y : size.y/7
	}
	laneSize = poolBounds.height * 0.25;

	splash = new PIXI.Sprite(PIXI.loader.resources.splash.texture);
	splash.delay = 60;
	game.addChild(splash);
	//arena = new Arena();
//	win = new Win([3, 5, 4, 2]);
	// setup resize
	window.onresize = onResize;
	onResize();

	// start the main loop
	main();
}

function onResize() {
	_resize();
	screen_filter.uniforms["screenSize"] = [size.x,size.y];
	screen_filter.uniforms["bufferSize"] = [nextPowerOfTwo(size.x),nextPowerOfTwo(size.y)];
	console.log("Resized",size,scaleMultiplier,[size.x*scaleMultiplier,size.y*scaleMultiplier]);
}

function update(){
	shaderAmount = lerp(shaderAmount, (state === SPLASH ? transition : 1), 0.1);
	if( state === SPLASH ){
		if(splash.delay == 60 && transition > 0){
			transition -= 0.005;
			if(transition <= 0){
				transition = 0;
				splash.delay -= 1;
			}
		}else if(splash.delay > 0){
			splash.delay -= 1;
		}else if(splash.delay == 0 && transition < 1){
			transition += 0.05;
		}else{
			splash.destroy();
			splash = null;
			menu = new Menu([]);
			state = MENU;
			shaderAmount = 1;
		}
	}if( state === MENU ){
		menu.lobbyUpdate();
		if(menu.isDone()){
			state = BEAN;
		}else{
			if(transition > 0){
				transition -= 0.01;
			}
		}
	}if(state === BEAN){
		menu.beanUpdate();
		if(menu.isBeaned()){
			if(transition < 1){
				transition += 0.01;
			}else{
				//sounds[""].play();
				arena = new Arena(menu.getPlayers());
				arena.bean(menu.whoIsBeaned);
				menu.destroy();
				menu = false;
				state = GAME;
			}
		}
	}if( state === GAME ){
		transition = lerp(transition,0,0.05);
		arena.update();
		if( arena.isDone() ){
			var scores = arena.getScores();
			var beaned = arena.getBeaned();
			win = new Win(scores, beaned, arena.getIds());
			state = WIN;
			transition = 1;
		}
	}if(state === WIN){
		transition = lerp(transition,0,0.05);
		win.update();
		if( win.isDone() ){
			win.destroy();
			state = MENU;
			menu = new Menu( win.getIds() );
			transition = 1;
		}
	}


	if(keys.isJustDown(keys.ENTER)){
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

	screen_filter.uniforms["amount"] = shaderAmount;
	screen_filter.uniforms["transition"] = transition;
	screen_filter.uniforms["curTime"] = curTime;

	if(state === MENU || state === BEAN){
		menu.render();
	}if(state === GAME){
		arena.render();
	}if(state === WIN){
		win.render();
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
		case 0:
		keyConfig.strokeLeft = keys.Q;
		keyConfig.strokeRight = keys.W;
		keyConfig.dive = keys.A;
		keyConfig.swap = keys.S;
		break;

		case 1:
		keyConfig.strokeLeft = keys.R;
		keyConfig.strokeRight = keys.T;
		keyConfig.dive = keys.F;
		keyConfig.swap = keys.G;
		break;

		case 2:
		keyConfig.strokeLeft = keys.U;
		keyConfig.strokeRight = keys.I;
		keyConfig.dive = keys.J;
		keyConfig.swap = keys.K;
		break;

		case 3:
		keyConfig.strokeLeft = keys.P;
		keyConfig.strokeRight = keys.SQUARE_BRACKET_OPEN;
		keyConfig.dive = keys.SEMI_COLON;
		keyConfig.swap = keys.SINGLE_QUOTE;
		break;

		default:
	}

	if(keys.isJustDown(keyConfig.strokeLeft)){ res.strokeLeft = true; }
	if(keys.isJustDown(keyConfig.strokeRight)){ res.strokeRight = true; }
	if(keys.isJustDown(keyConfig.dive)){ res.dive = true; }
	if(keys.isJustDown(keyConfig.swap)){ res.swap = true; }

	/*
	// gamepad input
	|| gamepads.isDown(gamepads.DPAD_LEFT, _playerId)){ res.x -= 1; }
	if(gamepads.axisPast(gamepads.LSTICK_H, 0.5, 1, _playerId) || gamepads.isDown(gamepads.DPAD_RIGHT, _playerId)){ res.x += 1; }
	if(gamepads.axisPast(gamepads.LSTICK_V, -0.5, -1, _playerId) || gamepads.isDown(gamepads.DPAD_UP, _playerId)){ res.y -= 1; }
	if(gamepads.axisPast(gamepads.LSTICK_V, 0.5, 1, _playerId) || gamepads.isDown(gamepads.DPAD_DOWN, _playerId)){ res.y += 1; }
	*/

	if(gamepads.isJustDown(gamepads.LT, _playerId)){ res.strokeLeft = true; }
	if(gamepads.isJustDown(gamepads.RT, _playerId)){ res.strokeRight = true; }
	if(gamepads.isJustDown(gamepads.A, _playerId) || gamepads.isJustDown(gamepads.Y, _playerId) ){ res.dive = true; }
	if(gamepads.isJustDown(gamepads.X, _playerId) || gamepads.isJustDown(gamepads.B, _playerId) ){ res.swap = true; }

	return res;
}
