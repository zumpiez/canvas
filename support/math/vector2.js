Cale.Vector2 = function(x, y) {
    var self = this;

    this.x = x || 0;
    this.y = y || 0;

    //add two vectors, immutable style
    this.add = function(vector) {
        var x, y;

        x = self.x + vector.x;
        y = self.y + vector.y;

        return new Cale.Vector2(x,y);
    };

    //subtract two vectors, immutable style
    this.subtract = function(vector) {
        var x, y;

        x = self.x - vector.x;
        y = self.y - vector.y;

        return new Cale.Vector2(x,y);
    };

    //scale a vector by a scalar amount, immutable style
    this.scale = function(scalar) {
        var x, y;

        x = self.x * scalar;
        y = self.x * scalar;

        return new Cale.Vector2(x,y);
    };
    
    // calculate the magnitude of a vector
    this.magnitude = function () {
        return Math.sqrt(self.x * self.x, self.y * self.y);
    };
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
