// a sound class
Cale.Sound = function (options) {
    // store the actual audio object, store load state
    var audio, isLoaded = false;

    // sanitize the options a bit
    options = options || {};

    // the audio source
    this.src = function (src) {
        var prev;
        // if we are functioning as a setter
        if (!!src) {
            // if the audio object exists
            if (!!audio) {
                // store the previous object
                prev = audio.src;
                // check to see if the source is different as we only
                // need to change the source if it needs modification
                if (prev !== src) {
                    // set the new source on the audio object
                    audio.src = src;
                    // we need to reload the data
                    isLoaded = false;
                }
                // return this for chaining
                return this;
            } else {
                // otherwise store the source in options so that
                // loading will work right
                options.src = src;
            }
        } else {
            // we are a getter
            // if the audio object exists use its source,
            // otherwise use the initial option source
            return (!!audio) ? audio.src : options.src;
        }
    };

    // load the audio file (potentially async)
    this.load = function (callback) {
        // capture this
        var self = this;
        // if the audio isn't loaded yet
        if (!isLoaded) {
            // create a new audio object
            audio = new Audio(this.src());
            // attach an event handler (this check is pivotal)
            Cale.on(audio, "canplaythrough", function () {
                // we are loaded now, and should be able to play through
                // the entirety of the file
                isLoaded = true;
                // if callback is a function then call it
                if (Cale.isFunction(callback)) {
                    callback.call(self);
                }
            });
        } else {
            // if callback is defined then call it as the content should
            // already be loaded at this point
            if (Cale.isFunction(callback)) {
                callback.call(self);
            }
        }
        // return self for chaining
        return self;
    };

    // play from the beginning
    this.play = function () {
        // load if we need to (potentially async) and return this for chaining
        return this.load(function () {
            // play the audio with the native API call
            audio.play();
            // if play is a function then call it
            if (Cale.isFunction(options.play)) {
                options.play.call(this);
            }
        });
    };

    // pause
    this.pause = function () {
        // if there is something to pause
        if (!!audio) {
            // pause the audio with the native API call
            audio.pause();
            // if pause is a function then call it
            if (Cale.isFunction(options.pause)) {
                options.pause.call(this);
            }
        }
        // return this for chaining
        return this;
    };

    // resume
    this.resume = function () {
        // if there is something to resume
        if (!!audio) {
            // play the audio with the native API call
            audio.play();
            // if resume is a function then call it
            if (Cale.isFunction(options.resume)) {
                options.resume.call(this);
            }
        }
        // return this for chaining
        return this;
    };

    // current volume
    this.volume = function (volume) {
        // variable to trap the current audio volume
        var prev;
        // if we are using this function as a setter
        if (!!volume) {
            // if audio exists...
            if (!!audio) {
                // capture the current volume
                prev = audio.volume;
                // ...and the volume is actually changing
                if (volume !== prev) {
                    // then change the volume
                    audio.volume = volume;
                    // check to see if a volume callback is defined
                    if (typeof options.volume === "function") {
                        options.volume.call(this, prev, volume);
                    }
                }
            }
            // return this for chaining
            return this;
        } else {
            // otherwise treat this like a getter and return
            // the current volume if we can or one
            return (!!audio) ? audio.volume : 1;
        }
    };

    // toggle mute
    this.mute = function () {
        // if we even have an audio object yet
        if (!!audio) {
            // toggle the muted state
            audio.muted = !audio.muted;
        }
        // return this for chaining
        return this;
    };

    // if the data should be pre-loaded, or auto played
    if (options.shouldAutoLoad === true || options.shouldAutoPlay === true) {
        // call the load function (potentially async!)
        this.load(function () {
            // we make this check because it is possible that only the
            // data was meant to be loaded, and not played automatically
            if (options.shouldAutoPlay === true) {
                // then play it
                this.play();
            }
        });
    }
};