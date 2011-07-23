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
        // cache, pending with callbacks, lazy load head, last DOM position
        var loaded = {}, pending = {}, head, lastScript;

        // sanitize a requirement
        function toScriptFile(requirement) {
            // assume a string for better or worse
            var file = requirement;
            // append the extension if it doesn't exist
            if (file.search(/\.js$/) === -1) {
                file += ".js";
            }
            return file;
        }

        // create a script tag from a requirement
        function require(requirement) {
            // the script element
            var script = document.createElement("script");
            // make this work with HTML<5
            script.setAttribute("type", "text/javascript");
            // we want to load async
            script.async = true;
            // we need to add a handler to capture when a script loads
            Cale.on(script, "load", function () {
                // set load completed
                loaded[requirement] = true;
                // iterate over callbacks for this requirement
                Cale.each(pending[requirement], function (callback) {
                    // notify them
                    callback(requirement);
                });
                // remove the callbacks
                delete pending[requirement];
            });
            // set the script source
            script.src = requirement;
            // lazy load head
            head = head || document.getElementsByTagName("head")[0];
            // insert the script element somewhere...
            lastScript = head.insertBefore(script, (!lastScript) ?
                head.firstChild : lastScript.nextSibling);
        }

        // require a script, or array of scripts
        Cale.require = function (requirements, callback) {
            var file, clone, check, isNew = false, satisfied = true;
            // single file, or multiple files?
            if (typeof requirements === "string") {
                // make a file from the requirement
                file = toScriptFile(requirements);
                // if this has already loaded
                if (loaded.hasOwnProperty(file)) {
                    // if callback is a function then call it
                    if (Cale.isFunction(callback)) {
                        callback(file);
                    }
                } else {
                    // otherwise if this hasn't been requested for load
                    if (!pending.hasOwnProperty(file)) {
                        // create the property with an array for callbacks
                        pending[file] = [];
                        // signify that a require call is necessary
                        isNew = true;
                    }
                    // if callback is a function
                    if (Cale.isFunction(callback)) {
                        // add it to the list of callbacks for this requirement
                        pending[file].push(callback);
                    }
                    // is this a new request?
                    if (isNew) {
                        // then require (load) the file
                        require(file);
                    }
                }
            } else if (Cale.isArray(requirements)) {
                // we need to make a copy of the array because we need to
                // make changes to it
                clone = requirements.slice(0);
                // check if all requirements have been loaded
                check = function (script) {
                    // iterate over the outstanding requirements
                    Cale.each(clone, function (requirement, index) {
                        // if this is an outstanding script
                        if (requirement === script) {
                            // remove it from the list
                            clone.splice(index, 1);
                            // if we are all done and callback is a function
                            if (!clone.length && Cale.isFunction(callback)) {
                                // call it
                                callback(requirements);
                            }
                            // break out of the each as we are done here
                            return false;
                        }
                    });
                };
                // iterate over the requirements
                Cale.each(clone, function (requirement, index) {
                    // create a file from the requirement
                    file = toScriptFile(requirement);
                    // we need to make sure that our clone has the sanitized
                    // file names instead of any shorthand, so that later in
                    // the check we can identify scripts correctly
                    if (file !== requirement) {
                        clone[index] = file;
                    }
                    // if the requirement hasn't loaded yet
                    if (!loaded.hasOwnProperty(file)) {
                        // then we haven't satisifed the requirements
                        satisfied = false;
                        // if this script hasn't been requested for load
                        if (!pending.hasOwnProperty(file)) {
                            // create the request with an array for callbacks
                            pending[file] = [];
                            // signify that a require call is necessary
                            isNew = true;
                        }
                        // push the check function for this file
                        pending[file].push(check);
                        // is this a new request?
                        if (isNew) {
                            // then require (load) the file
                            require(file);
                        }
                    } else {
                        // we've loaded the file so remove it from the array
                        clone.splice(index, 1);
                    }
                });
                // if we iterated over all the requirements and they are all
                // loaded, and callback is a function
                if (satisfied && Cale.isFunction(callback)) {
                    // signal completion
                    callback(requirements);
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