Cale.require("vector2");
Cale.require("component");
Cale.require("container");

// setup inheritance
Cale.inherit(Cale.Entity, Cale.Container);

Cale.Entity = function (options) {
    options = options || {};

    // continue the inheritance
    Cale.inherit(this, Cale.Container, options);

    if (!!options.translation) {
        this.translation = options.translation;
    } else if (!!options.x || !!options.y) {
        this.translation = new Cale.Vector2(options.x, options.y);
    } else {
        this.translation = Cale.Vector2.zero();
    }
};

Cale.Entity.prototype.update = function (gametime) {
    return this;
};

Cale.Entity.prototype.draw = function (graphics) {
    return this;
};