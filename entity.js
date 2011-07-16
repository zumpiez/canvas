function Entity(options) {
    options = options || {};
    
    if(!!options.translation) {
        this.translation = options.translation;
    } else if (!!options.x || !!options.y) {
        this.translation = new Vector2(options.x, options.y);
    } else {
        this.translation = Vector2.zero();
    }
};

Entity.prototype.update = function (gametime) {
    return this;
};

Entity.prototype.draw = function (graphics) {
    return this;
};