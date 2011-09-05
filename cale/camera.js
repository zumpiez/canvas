// we need them there vectors
requirement(["engine/component.js", "support/math/vector2.js"], function () {
    Cale.Camera = function (options) {
        var zoom, rotation, position;

        options = options || {};

        Cale.inherit(this, Cale.Component, options);

        zoom = options.zoom || 1;

        rotation = options.rotation || 0;

        if (!!options.position) {
            position = options.position;
        } else if (!!options.x || !!options.y) {
            position = new Cale.Vector2(options.x, options.y);
        } else {
            position = Cale.Vector2.zero();
        }

        // zoom
        this.zoom = function (z) {
            if (!!z) {
                // hint as number
                zoom = +z;
                return this;
            } else {
                return zoom;
            }
        };

        // rotate
        this.rotation = function (r) {
            if (!!r) {
                // hint as number
                rotation = +r;
                return this;
            } else {
                return rotation;
            }
        };

        // position
        this.position = function (p) {
            if (!!p) {
                position = p;
                return this;
            } else {
                return position;
            }
        };
    };

    Cale.inherit(Cale.Camera, Cale.Component);
});