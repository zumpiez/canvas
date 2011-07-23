Cale.Game = function (options) {
    var self = this, timeout = null, start, last, game, accumulator, timestep;

    options = options || {};

    // in milliseconds
    timestep = options.timestep || 10;

    // is the game loop running?
    this.isRunning = function () {
        return null !== timeout;
    };

    // when did the last game loop start in REAL TIME?
    this.startTime = function () {
        return (self.isRunning()) ? start : 0;
    };

    // inspirations:
    //      http://gafferongames.com/game-physics/fix-your-timestep/
    //      http://blog.gameclosure.com/?p=111
    this.start = function () {
        if (!self.isRunning()) {
            start = last = +new Date();
            // reset the accumulator and game time
            accumulator = game = 0;
            // start the game loop as soon as possible
            timeout = setTimeout(function gameLoop() {
                var now = +new Date(), dt = now - last;
                // remember to keep track of the last loop time!
                last = now;
                // add the elapsed time to the accumulator
                accumulator += dt;
                while (accumulator >= timestep) {
                    // increment the game time
                    game += timestep;
                    // if update is a function then call it
                    if (Cale.isFunction(options.update)) {
                        options.update.call(self, {
                            elapsedGameTime: timestep,
                            totalGameTime: game
                        });
                    }
                    // decrement the fixed step from the accumulator
                    accumulator -= timestep;
                }
                // if draw is a function then call it
                if (Cale.isFunction(options.draw)) {
                    options.draw.call(self);
                }
                // check to see that the game hasn't been stopped and
                // continue only if the game is still running
                if (self.isRunning()) {
                    timeout = setTimeout(gameLoop, 0);
                }
            }, 0);
        }
        // return self for chaining
        return self;
    };

    // stop running the game loop
    this.stop = function () {
        // check to see that the game is running
        if (self.isRunning()) {
            // clear the timeout
            clearTimeout(timeout);
            // set the timeout to null so that the running logic
            // will work correctly
            timeout = null;
        }
        // return self for chaining
        return self;
    };
};