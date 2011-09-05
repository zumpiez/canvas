requirement(["engine/entity.js", "system/graphics.js"], function () {
    //option parameters supported thus far:
    //
    //timestep: The game loop runs exactly once every [timestep] milliseconds. 
    //          Default is 10 (1000/10 = 100 loops/sec)
    //canvasSize{width, height}: The width and height of the canvas that will be
    //                           added to the document during initialization.
    //                           Default size is 256x256, because why not.
    //canvasContainer: A DOM element that will be parent to the canvas.
    //                 If you don't specify this, it'll just be spit into BODY.
    Cale.Game = function (options) {
        var self = this, timeout = null, start, last, game, accumulator, 
            graphics, world, timestep;

        //Set Defaults

        options = options || {};
        // in milliseconds
        timestep = options.timestep || 10;
        options.canvasSize = options.canvasSize || {width: 256, height: 256};
        options.canvasContainer = options.canvasContainer || document.body;

        // is the game loop running?
        this.isRunning = function () {
            return null !== timeout;
        };

        // when did the last game loop start in REAL TIME?
        this.startTime = function () {
            return (self.isRunning()) ? start : 0;
        };

        // the graphics
        this.graphics = function () {
            var canvas;

            if (!graphics) {
                canvas = document.createElement("canvas");

                canvas.width = options.canvasSize.width;
                canvas.height = options.canvasSize.height;

                graphics = new Cale.Graphics({ canvas: canvas });

                options.canvasContainer.appendChild(canvas);
            }

            return graphics;
        };

        // the world
        this.world = function () {
            if (!world) {
                world = new Cale.Entity();
            }
            return world;
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
});