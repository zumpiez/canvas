/*
    jslint
        devel: true,
        browser: true,
        confusion: false,
        sloppy: true,
        newcap: true,
        plusplus: true,
        maxerr: 50,
        indent: 4
*/

// closure for Cale
(function () {

    // trap the context, previous Cale, and create the root and namespace
    var root = this, previousCale = root.Cale, Cale = root.Cale = {};

    // don't step on toes
    Cale.noConflict = function () {
        root.Cale = previousCale;
        return this;
    };

    // is this an object?
    Cale.isObject = function (candidate) {
        // do the magic and return the result
        return (!!candidate && typeof candidate === "object" &&
            !(candidate instanceof Array));
    };

    // is this an array?
    Cale.isArray = function (candidate) {
        // if a native isArray function exists leverage it
        Cale.isArray = (!!Array.isArray) ?
            Array.isArray : function (candidate) {
                // do the magic and return the result since the browser won't
                // do the heavy lifting for us
                return (!!candidate && typeof candidate === "object" &&
                    candidate instanceof Array);
            };
        // finish lazy loading the isArray function by calling the new version
        return Cale.isArray(candidate);
    };

    // is this a function?
    Cale.isFunction = function (candidate) {
        return (!!candidate && typeof candidate === "function");
    };

    // logs to console without blowin' up
    Cale.log = function (message) {
        // if console is defined
        if (!!console) {
            // log a message
            console.log(message);
        }
    };

    // calls the passed function for each item in an array
    // function is called with the arguments (item, index, [args])
    Cale.each = function (enumerable, fn, args) {
        var index;
        // is fn even a function?
        if (Cale.isFunction(fn)) {
            // is enumerable an array?
            if (Cale.isArray(enumerable)) {
                // if the browser supports a native every function then
                // we should leverage that as it will be faster
                if (!!Array.prototype.every) {
                    // the return value will be true if we didn't break out
                    // of the every loop, and false if we did
                    return enumerable.every(function (item, index) {
                        // if the callback returns false then break
                        return (fn(item, index, args) !== false);
                    });
                } else {
                    // this browser doesn't support the native every function
                    // so we should just iterate the old fashioned way
                    // DON'T CACHE THE LENGTH AS IT CAN CHANGE UNDER US!!!
                    for (index = 0; index < enumerable.length; index++) {
                        // if the callback returns false then break
                        if (fn(enumerable[index], index, args) === false) {
                            return false;
                        }
                    }
                    return true;
                }
            } else if (Cale.isObject(enumerable)) {
                // no, enumerable is an object
                for (index in enumerable) {
                    if (enumerable.hasOwnProperty(index)) {
                        // if the callback returns false then break
                        if (fn(enumerable[index], index, args) === false) {
                            return false;
                        }
                    }
                }
                return true;
            }
        }
        // even worse still enumerable or fn is something unrecognizable
        return false;
    };

    // given a fully qualified object name, insures that each object in the
    // chain is instantiated.this function will not destroy any objects that
    // already exist.
    Cale.namespace = function (namespace) {
        var names = namespace.split("."), lastCreated = root;
        Cale.each(names, function (name) {
            // leave it alone if it exists, or create it now
            lastCreated[name] = lastCreated[name] || {};
            lastCreated = lastCreated[name];
        }, lastCreated);
    };

    // attach an event handler to a DOM element in a way that works in IE<9 as
    // well as real browsers
    Cale.on = function (el, event, fn) {
        if (typeof el === "string") {
            el = document.getElementById(el);
        }
        // redefine this function as the correct native method for the browser
        // (basically lazy loading)
        Cale.on = (!!el.addEventListener) ? function (el, event, fn) {
            if (typeof el === "string") {
                el = document.getElementById(el);
            }
            el.addEventListener(event, fn, false);
        } : function (el, event, fn) {
            if (typeof el === "string") {
                el = document.getElementById(el);
            }
            el.attachEvent("on" + event, fn);
        };
        // call the newly redefined function (from here on out the redefined
        // function will be used instead of this function body)
        Cale.on(el, event, fn);
    };

    // detach an event handler from a DOM element in a way that works in IE<9
    // as well as real browsers
    Cale.un = function (el, event, fn) {
        if (typeof el === "string") {
            el = document.getElementById(el);
        }
        // redefine this function as the correct native method for the browser
        // (basically lazy loading)
        Cale.un = (!!el.removeEventListener) ? function (el, event, fn) {
            if (typeof el === "string") {
                el = document.getElementById(el);
            }
            el.removeEventListener(event, fn, false);
        } : function (el, event, fn) {
            if (typeof el === "string") {
                el = document.getElementById(el);
            }
            el.detachEvent("on" + event, fn);
        };
        // call the newly redefined function (from here on out the redefined
        // function will be used instead of this function body)
        Cale.un(el, event, fn);
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

    // class augmentation
    Cale.augment = function (target, source) {
        var index, length, to, from;
        // sanitize to pending on type
        to = Cale.isFunction(target) ? target.prototype : target;
        // sanitize from pending on type
        from = Cale.isFunction(source) ? source.prototype : source;
        // if only a few properties should be copied
        if (arguments.length > 2) {
            // cache the length as that won't change
            length = arguments.length;
            // iterate over the arguments
            for (index = 2; index < length; index++) {
                // copy from source to target
                to[arguments[index]] = from[arguments[index]];
            }
        } else {
            // iterate over all properties in the source
            Cale.each(from, function (property, name) {
                // copy from souce to target
                to[name] = property;
            });
        }
    };

    //closure for Cale.require
    (function () {
        var pending = {}, loaded = {}, head;

        function script(file, async) {
            var head, script = document.createElement("script");
            script.src = file;
            script.async = async || false;

            script.onload = function () {
                var index, length;

                loaded[file] = true;

                if (!!pending[file]) {
                    length = pending[file].length;

                    for (index = 0; index < length; index++) {
                        pending[file][index](file);
                    }

                    delete pending[file];
                }
            };

            head = head || document.getElementsByTagName("head")[0];
            head.appendChild(script);
        }

        function requires(file, callback) {
            var isNewRequirement = false;

            if (loaded.hasOwnProperty(file)) {
                callback(file);
            } else {
                if (!pending.hasOwnProperty(file)) {
                    pending[file] = [];
                    isNewRequirement = true;
                }
                if ("function" === typeof callback) {
                    pending[file].push(callback);
                }
                if (isNewRequirement) {
                    script(file);
                }
            }
        }

        Cale.require = function (requirement, callback) {
            var file, index, length, wrap, loaded;

            if (typeof requirement === "string") {
                file = requirement;

                if (file.search(/\.js$/) === -1) {
                    file += ".js";
                }

                requires(file, callback);
            } else if (Cale.isArray(requirement)) {
                loaded = 0;

                length = requirement.length;

                // wrap the callback to fire when all scripts are loaded
                wrap = function (script) {
                    loaded += 1;

                    if (loaded === length) {
                        if ("function" === typeof callback) {
                            callback(requirement);
                        }
                    }
                };

                for(index = 0; index < length; index++) {
                    Cale.require(requirement[index], wrap);
                }
            }
        };
    }());

    // require the configuration
    Cale.require("configuration", function () {
        // private recursive function for including requirements
        function include(requirement, parent) {
            // this is the terminal case as it means that we have a file
            if (typeof requirement === "string") {
                // load the requirement
                Cale.require((typeof parent === "string") ?
                    parent + "/" + requirement : requirement);
            } else if (Cale.isArray(requirement)) {
                // iterate over the array of requirements
                Cale.each(requirement, function (item) {
                    // recursively call the function as the array is just
                    // a simple, stupid container for requirements
                    include(item, parent);
                });
            } else if (Cale.isObject(requirement)) {
                // iterate over the requirement properties
                Cale.each(requirement, function (item, name) {
                    // recursively call the function as the object is a
                    // a container, but make sure to pass along the name
                    // of the property as the "parent" so that the requires
                    // are hierarchical
                    include(item, (typeof parent === "string") ?
                        parent + "/" + name : name);
                });
            }
        }
        // if we have things to include
        if (!!Cale.Configuration.includes) {
            // then include stuff
            include(Cale.Configuration.includes);
        }
    });
}());