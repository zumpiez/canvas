// we need them there vectors
Cale.require(["support/math/vector2", "support/math/vector3", "support/math/matrix"], function () {
    Cale.Camera = function (options) {
        options = options || {};

        this.zoom = options.zoom || 1;
        this.rotation = options.rotation || 0;

        // should this be a function, and not a property?
        // consistency?
        if (!!options.translation) {
            this.translation = options.translation;
        } else if (!!options.x || !!options.y) {
            this.translation = new Cale.Vector2(options.x, options.y);
        } else {
            this.translation = Cale.Vector2.zero();
        }
    };

    // move the camera by a vector amount
    Cale.Camera.prototype.move = function (amount) {
        this.translation = this.translation.add(amount);
    };

    // return the current camera transformation matrix
    Cale.Camera.prototype.transformation = function (graphics) {
        var position, viewport;

        position = new Cale.Vector3(-this.translation.x, -this.translation.y);

        viewport = new Cale.Vector3(graphics.width() / 2,
            graphics.height() / 2);

        return Cale.Matrix.createTranslation(position).multiply(
            Cale.Matrix.createRotation(this.rotation)).multiply(
                Cale.Matrix.createScale(this.zoom)).multiply(
                    Cale.Matrix.createTranslation(viewport));
    };
});