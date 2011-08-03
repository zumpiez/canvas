(function () {

    Cale.Input = {
        // make us a singleton
        // http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html
        // http://addyosmani.com/resources/essentialjsdesignpatterns/book/
        Keyboard: (function () {
            // the lazy loaded instance of the keyboard, and pub/sub namespaces
            var instance = null, id = 0, callbacks = {};

            function initialize() {
                // an index for key events
                var pressed = {};

                // attach a keydown handler to the window
                Cale.on(window, "keydown", function (e) {
                    // cross browser event
                    e = (!!e) ? e : window.event;
                    // add the property to the object (value doesn't matter)
                    pressed[e.keyCode] = true;

                    Cale.each(callbacks["keydown"], function (callback) {
                        callback(e);
                    });
                });

                // attach a keyup handler to the window
                Cale.on(window, "keyup", function (e) {
                    // cross browser event
                    e = (!!e) ? e : window.event;
                    // delete the property from the object
                    delete pressed[e.keyCode];

                    Cale.each(callbacks["keyup"], function (callback) {
                        callback(e);
                    });
                });

                // create the keyboard object literal and return it
                return {
                    isDown: function (keyCode) {
                        // if the property exists the key is down
                        return pressed.hasOwnProperty(keyCode);
                    },
                    onDown: function (callback) {
                        callbacks["keydown"] = callbacks["keydown"] || {};

                        if (Cale.isFunction(callback)) {
                            callbacks["keydown"][++id] = callback;
                            return id;
                        } else {
                            return false;
                        }
                    },
                    unDown: function (id) {
                        if (!!id && !!callbacks["keydown"]) {
                            if (!!callbacks["keydown"][id]) {
                                delete callbacks["keydown"][id];
                                return true;
                            }
                        }
                        return false;
                    },
                    onUp: function (callback) {
                        callbacks["keyup"] = callbacks["keyup"] || {};

                        if (Cale.isFunction(callback)) {
                            callbacks["keyup"][++id] = callback;
                            return id;
                        } else {
                            return false;
                        }
                    },
                    unUp: function (id) {
                        if (!!id && !!callbacks["keyup"]) {
                            if (!!callbacks["keyup"][id]) {
                                delete callbacks["keyup"][id];
                                return true;
                            }
                        }
                        return false;
                    }
                };
            }

            return {
                getInstance: function () {
                    // lazy load the keyboard instance
                    if (!instance) {
                        instance = initialize();
                    }
                    return instance;
                }
            };
        }()),
        // convenience object to map key codes
        // http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/javascript-char-codes-key-codes.aspx
        Keys: {
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
        }
    };
}());