//handy dandy javascript utilities

var utils = {};

//logs to console without blowin' up
utils.log = function (message) {
    if (!!console) {
        console.log(message);
    }
};

//given a fully qualified object name, insures that each object in the chain is instantiated.
//this function will not destroy any objects that already exist.
utils.namespace = function (namespace) {
    var names = namespace.split("."), lastCreated = window;
    utils.each(names, function (name, index, args) {
        lastCreated[name] = lastCreated[name] || {}; //leave it alone if it exists, or create it now
        lastCreated = lastCreated[name];
    }, lastCreated);
};

//calls the passed function for each item in an array
//function is called with the arguments (item, index, [args])
utils.each = function (array, fn, args) {
    var length = array.length, i;
    for (i = 0; i < length; i++) {
        fn(array[i], i, args);
    }
};

// attach an event handler to a DOM element in a way that works in IE<9 as well as real browsers
utils.on = function (el, event, fn) {
    if (!!el.addEventListener) {
        el.addEventListener(event, fn, false);
    } else {
        el.attachEvent("on" + event, fn);
    }
};

utils.un = function (el, event, fn) {
    if (!!el.removeEventListener) {
        el.removeEventListener(event, fn, false);
    } else {
        el.detachEvent("on" + event, fn);
    }
};

// inheritance
utils.inherit = function (child, parent) {
    var t = typeof child;
    if ("object" === t) {
        if (2 < arguments.length) {
            parent.apply(child,
                Array.prototype.slice.call(arguments, 2));
        } else {
            parent.call(child);
        }
    } else if ("function" === t) {
        child.prototype = new parent();
        child.prototype.constructor = child;
    }
};