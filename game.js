function Game(options) {
	var self = this, timeout = null, start, last,
		accumulator, timestep;
	options = options || {};

	// in milliseconds
	timestep = options.timestep || 10;

	// is the game loop running?
	this.isRunning = function(){
		return null !== timeout;
	};

	// when did the last game loop start in REAL TIME?
	this.startTime = function(){
		return (self.isRunning()) ? start : 0;
	};

	// inspirations:
	//      http://gafferongames.com/game-physics/fix-your-timestep/
	//      http://blog.gameclosure.com/?p=111
	this.start = function(){
		if(false === self.isRunning()){
			start = last = +new Date();
			// reset the accumulator
			accumulator = 0;
			// start the game loop as soon as possible
			timeout = setTimeout(function gameLoop(){
				var now = +new Date(), dt = now - last;
				accumulator += dt;
				while(accumulator >= timestep){
					if("function" === typeof options.update){
						options.update.call(self, timestep);
					}
					accumulator -= timestep;
				}
				if("function" === typeof options.draw){
					options.draw.call(self);
				}
				if(true === self.isRunning()){
					timeout = setTimeout(gameLoop, 0);
				}
			}, 0);
		}
		return self;
	};

	// stop running the game loop
	this.stop = function(){
		if(true === self.isRunning()){
			clearTimeout(timeout);
			timeout = null;
		}
		return self;
	};
}