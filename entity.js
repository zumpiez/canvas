function Entity(options) {
    options = options || {};
    this.x = options.x || 0;
    this.y = options.y || 0;
};

Entity.prototype.update = function (gametime) {
    return this;
};

Entity.prototype.draw = function (context) {
    return this;
};