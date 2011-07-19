Cale.Sound = {
    load: function (options) {
        // a variable to store the actual audio file
        var audio;
        // sanitize the options a bit
        options = options || {};
        // create our wrapper audio object and return it
        return {
            // the source of the audio
            src: function () {
                // if the audio object exists use its source,
                // otherwise use the initial option source
                return (!!audio) ? audio.src : options.src;
            },
            // play from the beginning
            play: function () {
                // if the audio object already exists
                if (!!audio) {
                    // pause the current audio
                    audio.pause();
                    // delete the audio so we can recreate it
                    delete audio;
                }
                // create a new audio object
                audio = new Audio(this.src());
                // play the audio with the native API call
                audio.play();
                // check to see if a play callback is defined
                if (typeof options.play === "function") {
                    options.play.call(this);
                }
                // return this for chaining
                return this;
            },
            // pause
            pause: function () {
                // if there is something to pause
                if (!!audio) {
                    // pause the audio with the native API call
                    audio.pause();
                    // check to see if a pause callback is defined
                    if (typeof options.pause === "function") {
                        options.pause.call(this);
                    }
                }
                // return this for chaining
                return this;
            },
            // resume
            resume: function () {
                // if there is something to resume
                if (!!audio) {
                    // play the audio with the native API call
                    audio.play();
                    // check to see if a resume callback is defined
                    if (typeof options.resume === "function") {
                        options.resume.call(this);
                    }
                }
                // return this for chaining
                return this;
            },
            // current volume
            volume: function (volume) {
                // trap the current audio volume
                var prev = audio.volume;
                // if we are using this function as a setter and
                // the volume is ACTUALLY going to be changed...
                if (!!volume && volume !== prev) {
                    // change the volume
                    audio.volume = volume;
                    // check to see if a volume callback is defined
                    if (typeof options.volume === "function") {
                        options.volume.call(this, prev, volume);
                    }
                    // return this for chaining
                    return this;
                } else {
                    // otherwise treat this like a getter and return
                    // the current volume
                    return prev;
                }
            }
        };
    }
};