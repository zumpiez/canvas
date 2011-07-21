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
        var index, length;
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
                    length = enumerable.length;
                    for (index = 0; index < length; index++) {
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
        // redefine this function as the correct native method for the browser
        // (basically lazy loading)
        Cale.on = (!!el.addEventListener) ? function (el, event, fn) {
            el.addEventListener(event, fn, false);
        } : function (el, event, fn) {
            el.attachEvent("on" + event, fn);
        };
        // call the newly redefined function (from here on out the redefined
        // function will be used instead of this function body)
        Cale.on(el, event, fn);
    };

    // detach an event handler from a DOM element in a way that works in IE<9
    // as well as real browsers
    Cale.un = function (el, event, fn) {
        // redefine this function as the correct native method for the browser
        // (basically lazy loading)
        Cale.un = (!!el.removeEventListener) ? function (el, event, fn) {
            el.removeEventListener(event, fn, false);
        } : function (el, event, fn) {
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

    // closure for cale pub/sub implementation
    (function () {
        var namespaces = {}, id = 0;

        // subscribe
        Cale.subscribe = function (namespace, callback) {
            var token = false;
            // if callback is a function then we can proceed
            if (Cale.isFunction(callback)) {
                // generate the unique subscriber token
                token = (+new Date() * 100) + (id % 100);
                // increment id (unique subscriber id)
                id += 1;
                // if no subscribers exist for this namespace then create the
                // namespace and corresponding subscribers array
                if (!namespaces.hasOwnProperty(namespace)) {
                    namespaces[namespace] = [];
                }
                // add this subscriber to the namespace subscriptions
                namespaces[namespace].push({
                    token: token,
                    callback: callback
                });
            }
            // return the unique subscriber token if callback is a function
            // and false otherwise (indicating a failure)
            return token;
        };

        // unsubscribe
        Cale.unsubscribe = function (token) {
            // iterate over the subscribers across all namespaces and return
            // the result of the iteration (as a false return value will
            // cause us to break from the loop indicating success)
            return !Cale.each(namespaces, function (subscribers) {
                // iterate over the subribers in a single namespace and return
                // the result of the iteration (as a false return value will
                // cause us to break from the loop indicating success)
                return Cale.each(subscribers, function (subscriber, index) {
                    // if this is the subscriber wishing to unsubscribe
                    if (token === subscriber.token) {
                        // remove them from the array of subscribers
                        subscribers.splice(index, 1);
                        // return false to exit the loop
                        return false;
                    }
                });
            });
        };

        // publish
        Cale.publish = function (namespace, message) {
            // if no subscribers exist for this namespace then forego work
            if (!namespaces.hasOwnProperty(namespace)) {
                return false;
            } else {
                // iterate over the subscribers in the namespace
                Cale.each(namespaces[namespace], function (subscriber) {
                    // notify the current subscriber
                    subscriber.callback(message);
                });
                return true;
            }
        };
    }());

    //closure for Cale.require
    (function () {
        // a map that will store the loaded files, and DOM position
        var loaded = {}, head, lastScript;

        // create the require function
        Cale.require = function (requirement, callback) {
            var script = null, file = requirement;
            // check to see if the file extension is supplied
            if (file.search(/\.js$/) === -1) {
                // add it if it wasn't
                file += ".js";
            }
            // if we haven't loaded this requirement then we need to do so
            if (!loaded.hasOwnProperty(file)) {
                // create a script element
                script = document.createElement("script");
                // add the type attribute as it is required in HTML<5
                script.setAttribute("type", "text/javascript");
                // set the source of the script to the file
                script.src = file;
                // get the head tag (assume it is there)
                head = head || document.getElementsByTagName("head")[0];
                // if this is the first script insert it as the first
                // child, otherwise insert it as the next child (which
                // can potentially be the last)
                lastScript = head.insertBefore(script, (!lastScript) ?
                    head.firstChild : lastScript.nextSibling);
                // register that the script has been loaded
                loaded[file] = true;
            }
            // if a callback is a function then we need to invoke that sucker
            if (Cale.isFunction(callback)) {
                callback.call();
            }
        };
    }());

    //requires
    Cale.require("input");
    Cale.require("sound");
    Cale.require("graphics");
    Cale.require("camera");
    Cale.require("game");
    Cale.require("entity");
}());