Cale.require(["support/math/vector2", "engine/component"], function () {
    Cale.Entity = function (options) {
        var self = this;
        
        options = options || {};

        if (!!options.translation) {
            this.translation = options.translation;
        } else if (!!options.x || !!options.y) {
            this.translation = new Cale.Vector2(options.x, options.y);
        } else {
            this.translation = Cale.Vector2.zero();
        }
        
        // subscribe to global update messages
        Cale.subscribe("update", function (gametime) {
            self.update(gametime);
        });
        // subscribe to global draw messages
        Cale.subscribe("draw", function (graphics) {
            self.draw(graphics);
        });
    };

    Cale.Entity.prototype.update = function (gametime) {
        return this;
    };

    Cale.Entity.prototype.draw = function (graphics) {
        return this;
    };
});