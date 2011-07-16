function Graphics(options) {
    var self = this, type, canvas, context;

    options = options || {};

    // get the type of the canvas
    type = typeof options.canvas;

    // let's get the canvas, somehow...
    if ("object" === type) {
        // null is an object :(
        if(null !== options.canvas) {
            canvas = options.canvas;
        }
    } else if("string" === type) {
        // treat canvas as an id selector
        canvas = document.getElementById(options.canvas);
    }

    // get the canvas
    this.canvas = function() {
        return canvas;
    };

    // get the drawing context
    this.context = function() {
        // lazy load the drawing context
        if (!context) {
            context = canvas.getContext("2d");
        }
        return context;
    };

    // get or set the height
    this.height = function(height) {
        if (!!height) {
            // force height to a number
            canvas.height = +height;
            return self;
        } else {
            // treat the call as a getter
            return canvas.height;
        }
    };

    // get or set the width
    this.width = function(width) {
        if (!!width) {
            // force width to a number
            canvas.width = +width;
            // return self for chaining
            return self;
        } else {
            // treat the call as a getter
            return canvas.width;
        }
    };

    // clear the canvas of everything
    this.clear = function() {
        canvas.width = canvas.width;
        return self;
    };

    // write some text
    this.text = function(options) {
        var context = self.context();
        options = options || {};
        context.fillText(options.text, options.x, options.y);
        return self;
    };

    // draw a circle
    this.arc = function(options) {
        var context = self.context();
        options = options || {};
        context.beginPath();
        context.arc(options.x, options.y, options.radius,
            options.startAngle || 0, options.endAngle || Math.PI * 2,
            options.anticlockwise || false);
        context.closePath();
        return self;
    };

    // fill
    this.fill = function() {
        var context = self.context();
        context.fill();
        return self;
    };

    // stroke
    this.stroke = function() {
        var context = self.context();
        context.stroke();
        return self;
    };
}