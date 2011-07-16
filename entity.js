(function () {

    // alias the namespace for brevity
    var Utils = Cale.Utils;

    // setup inheritance
    Utils.inherit(Cale.Entity, Cale.Container);

    Cale.Entity = function (options) {
        options = options || {};

        // continue the inheritance
        Utils.inherit(this, Cale.Container, options);

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

}());