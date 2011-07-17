(function () {

    // trap the context, previous Cale, and create the root nd namespace
    var root = this, previousCale = root.Cale, Cale = root.Cale = {};

    // don't step on toes
    Cale.noConflict = function () {
        root.Cale = previousCale;
        return this;
    };
    
        //logs to console without blowin' up
    Cale.log = function (message) {
        if (!!console) {
            console.log(message);
        }
    };

    //given a fully qualified object name, insures that each object in the chain is instantiated.
    //this function will not destroy any objects that already exist.
    Cale.namespace = function (namespace) {
        var names = namespace.split("."), lastCreated = window;
        Cale.each(names, function (name, index, args) {
            lastCreated[name] = lastCreated[name] || {}; //leave it alone if it exists, or create it now
            lastCreated = lastCreated[name];
        }, lastCreated);
    };

    //calls the passed function for each item in an array
    //function is called with the arguments (item, index, [args])
    Cale.each = function (enumerable, fn, args) {
        var index, length;
        // null is an object
        if (!!enumerable) {
            // make sure enumerable is an object
            if (typeof enumerable === "object") {
                // if it is an array iterate the usual way
                if (enumerable instanceof Array) {
                    length = enumerable.length;
                    for (i = 0; i < length; i++) {
                        fn(enumerable[i], i, args);
                    }
                } else {
                    // otherwise iterate over enumerable as an object
                    for (index in enumerable) {
                        if (enumerable.hasOwnProperty(index)) {
                            fn(enumerable[index], index, args);
                        }
                    }
                }
            }
        }
    };

    // attach an event handler to a DOM element in a way that works in IE<9 as well as real browsers
    Cale.on = function (el, event, fn) {
        if (!!el.addEventListener) {
            el.addEventListener(event, fn, false);
        } else {
            el.attachEvent("on" + event, fn);
        }
    };

    // detach an event handler from a DOM element in a way that works in IE<9 as well as real browsers
    Cale.un = function (el, event, fn) {
        if (!!el.removeEventListener) {
            el.removeEventListener(event, fn, false);
        } else {
            el.detachEvent("on" + event, fn);
        }
    };

    // inheritance
    Cale.inherit = function (child, parent) {
        var t = typeof child;
        if (!!child && !!parent) {
            if (t === "object") {
                if (2 < arguments.length) {
                    parent.apply(child,
                        Array.prototype.slice.call(arguments, 2));
                } else {
                    parent.call(child);
                }
            } else if (t === "function") {
                child.prototype = new parent();
                child.prototype.constructor = child;
            }
        }
    };

    
}());