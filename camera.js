// we need them there vectors
Cale.require("vector2", function () {
    // camera obscura
    // guidance: http://forums.create.msdn.com/forums/p/77063/468360.aspx
    Cale.Camera = function (options) {
        // private variables for zoom and rotation
        var zoom, rotation;

        // sanitize the options a bit
        options = options || {};
        // initialize the zoom
        zoom = options.zoom || 1;
        // initialize the rotation
        rotation = options.rotation || 1;

        // should this be a function, and not a property?
        // consistency?
        if (!!options.translation) {
            this.translation = options.translation;
        } else if (!!options.x || !!options.y) {
            this.translation = new Cale.Vector2(options.x, options.y);
        } else {
            this.translation = Cale.Vector2.zero();
        }

        // zoom
        this.zoom = function (z) {
            // we are a setter
            if (!!z) {
                // update the zoom
                zoom = z;
                // return this for chaining
                return this;
            } else {
                // we are a getter so get them their zoom
                return zoom;
            }
        };

        // rotation
        this.rotation = function (r) {
            // we are a setter
            if (!!r) {
                // update the rotation
                rotation = r;
                // return this for chaining
                return this;
            } else {
                // we are a getter so get them their rotation
                return rotation;
            }
        };

        // move the camera by an amount
        this.move = function (amount) {
            // sanitize and massage amount a bit
            amount = amount || Cale.Vector2.zero();
            // update the camera position
            this.position = this.position.add(amount);
            // return this for chaining
            return this;
        };
    };
});