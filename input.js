(function () {

    // trap the context, and the previous Input, and create the namespace
    var root = this, previousInput = root.Input, Input = root.Input = {};

    // don't step on toes
    Input.noConflict = function () {
        root.Input = previousInput;
        return this;
    };

    // make us a singleton
    // http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
    // http://addyosmani.com/resources/essentialjsdesignpatterns/book/
    Input.Keyboard = (function () {
        // the lazy loaded instance of the keyboard
        var instance = null;

        function initialize() {
            // an index for key events
            var pressed = {};

            // create the keyboard object literal and return it
            return {
                isDown: function (keyCode) {
                    // if the property exists the key is down
                    return pressed.hasOwnProperty(keyCode);
                },
                onKeydown: function (e) {
                    // cross browser event
                    e = (!!e) ? e : window.event;
                    // add the property to the object (value doesn't matter)
                    pressed[e.keyCode] = true;
                },
                onKeyup: function (e) {
                    // cross browser event
                    e = (!!e) ? e : window.event;
                    // delete the property from the object
                    delete pressed[e.keyCode];
                }
            };
        }

        return {
            getInstance: function () {
                // lazy load the keyboard instance
                if (null === instance) {
                    instance = initialize();
                }
                return instance;
            }
        };
    }());

    // convenience object to map key codes
    // http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/javascript-char-codes-key-codes.aspx
    Input.Keys = {
        ESCAPE: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        A: 65,
        D: 68,
        S: 83,
        W: 87
    };

}());