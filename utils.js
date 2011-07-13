//handy dandy javascript utilities

var utils = {};

//logs to console without blowin' up
utils.log = function(message) {
	if(!!console) {
		console.log(message);
	}
}	

//given a fully qualified object name, insures that each object in the chain is instantiated.
//this function will not destroy any objects that already exist.
utils.namespace = function(namespace) {
	var names = namespace.split(".");

	var lastCreated = window
	utils.each(names, function(name, index, args) {
		lastCreated[name] = lastCreated[name] || {}; //leave it alone if it exists, or create it now
		lastCreated = lastCreated[name];
	}, lastCreated)
}

//calls the passed function for each item in an array
//function is called with the arguments (item, index, [args])
utils.each = function(array, fn, args) {
	var length = array.length;
	for(var i = 0; i < length; i++) {
		fn(array[i], i, args);
	}
}

// attach an event handler to a DOM element in a way that works in IE<9 as well as real browsers
utils.on = function(el, event, fn) {
	if(!!el.addEventListener) {
		el.addEventListener(event, fn, false);
	}else{
		el.attachEvent("on" + event, fn);
	}
}