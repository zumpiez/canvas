Vector2 = function(x, y) {
    var self = this;

    this.x = x || 0;
    this.y = y || 0;

    //add two vectors, immutable style
    this.add = function(vector) {
        var x, y;

        x = self.x + vector.x;
        y = self.y + vector.y;

        return new Vector2(x,y);
    };

    //subtract two vectors, immutable style
    this.subtract = function(vector) {
        var x, y;

        x = self.x - vector.x;
        y = self.y - vector.y;

        return new Vector2(x,y);
    };

    //scale a vector by a scalar amount, immutable style
    this.scale = function(scalar) {
        var x, y;

        x = self.x * scalar;
        y = self.x * scalar;

        return new Vector2(x,y);
    };
};