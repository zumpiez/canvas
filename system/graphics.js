//config properties:
//canvas: a reference to a canvas tag, either by ID (string) or a reference
//        to a DOMCanvasTag
Cale.Graphics = function (config) {
    var type, canvas, context;

    config = config || {};

    debugger;
    if(!!config.canvas) {
        switch(typeof(config.canvas)) {
            case 'string':
                canvas = document.getElementById(config.canvas);
                break;
            case 'object':
                canvas = config.canvas;
                break;
        }
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
};

    // get or set the height
Cale.Graphics.prototype.height = function(height) {
    if (!!height) {
        // force height to a number
        this.canvas().height = +height;
        return this;
    } else {
        // treat the call as a getter
        return this.canvas().height;
    }
};

    // get or set the width
Cale.Graphics.prototype.width = function(width) {
    if (!!width) {
        // force width to a number
        this.canvas().width = +width;
        // return this for chaining
        return this;
    } else {
        // treat the call as a getter
        return this.canvas().width;
    }
};

// clear the canvas of everything
Cale.Graphics.prototype.clear = function() {
    this.width(this.width());
    return this;
};

// write some text
Cale.Graphics.prototype.text = function(options) {
    var context = this.context();
    options = options || {};
    context.fillText(options.text, options.x, options.y);
    return this;
};

// draw a circle
Cale.Graphics.prototype.arc = function(options) {
    var context = this.context();
    options = options || {};
    context.beginPath();
    context.arc(options.x, options.y, options.radius,
        options.startAngle || 0, options.endAngle || Math.PI * 2,
        options.anticlockwise || false);
    context.closePath();
    return this;
};

// fill
Cale.Graphics.prototype.fill = function() {
    var context = this.context();
    context.fill();
    return this;
};

// stroke
Cale.Graphics.prototype.stroke = function() {
    var context = this.context();
    context.stroke();
    return this;
};

// push the last canvas transformation
Cale.Graphics.prototype.save = function () {
    var context = this.context();
    context.save();
    return this;
};

// pop the last saved canvas transformation
Cale.Graphics.prototype.restore = function () {
    var context = this.context();
    this.context().restore();
    return this;
};

// scale the canvas
Cale.Graphics.prototype.scale = function (options) {
    var context = this.context();
    options = options || {};
    if (!!options.x || !!options.y) {
        context.scale(options.x, options.y);
    } else if (!isNaN(options)) {
        context.scale(options, options);
    }
    return this;
};

// rotate by an angle around the origin
Cale.Graphics.prototype.rotate = function (angle) {
    var context = this.context();
    context.rotate(angle);
    return this;
};

// set the translation
Cale.Graphics.prototype.translate = function (options) {
    var context = this.context();
    options = options || {};
    context.translate(options.x, options.y);
    return this;
};

// changes the transformation matrix to apply the matrix
Cale.Graphics.prototype.transform = function (options) {
    var method, context = this.context();
    options = options || {};
    method = (options.set === true) ? "setTransform" : "transform";
    context[method](options.a, options.b, options.c,
        options.d, options.e, options.f);
    return this;
};