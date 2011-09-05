require(["math"], function () {
    Cale.Vector2 = function(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };

    // convert a matrix array into a vector (MAKES MAJOR ASSUMPTIONS)
    Cale.Vector2.fromArray = function (array) {
        return new Cale.Vector2({
            x: array[0][0],
            y: array[1][0]
        });
    };

    Cale.Vector2.zero = function() {
        return new Cale.Vector2(0,0);
    };

    Cale.Vector2.right = function() {
        return new Cale.Vector2(1,0);
    };

    Cale.Vector2.left = function() {
        return new Cale.Vector2(-1,0);
    };

    Cale.Vector2.up = function() {
        return new Cale.Vector2(0,-1);
    };

    Cale.Vector2.down = function() {
        return new Cale.Vector2(0,1);
    };

    //add two vectors, immutable style
    Cale.Vector2.prototype.add = function(vector) {
        var x, y;

        x = this.x + vector.x;
        y = this.y + vector.y;

        return new Cale.Vector2(x,y);
    };

    //subtract two vectors, immutable style
    Cale.Vector2.prototype.subtract = function(vector) {
        var x, y;

        x = this.x - vector.x;
        y = this.y - vector.y;

        return new Cale.Vector2(x,y);
    };

    //scale a vector by a scalar amount, immutable style
    Cale.Vector2.prototype.scale = function(scalar) {
        var x, y;

        x = this.x * scalar;
        y = this.x * scalar;

        return new Cale.Vector2(x,y);
    };

    // calculate the magnitude of a vector
    Cale.Vector2.prototype.magnitude = function () {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    };

    // rotate a vector by an angle, immutable style
    Cale.Vector2.prototype.rotate = function (angle) {
        var x, y, radians, cos, sin;

        radians = Cale.Math.degreesToRadians(angle);

        cos = Math.cos(radians);
        sin = Math.sin(radians);

        x = this.x * cos - this.y * sin;
        y = this.x * sin + this.y * cos;

        return new Cale.Vector2(x, y);
    };

    // return an array representing this vector as an array matrix
    Cale.Vector2.prototype.toArray = function () {
        return [[this.x], [this.y]];
    };
});