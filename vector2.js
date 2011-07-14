utils.namespace("game.vector2");

game.Vector2 = function(x, y) {
    var self = this;

    this.x = x || 0;
    this.y = y || 0;

    this.add = function(vector) {
        var x, y;

        x = self.x + vector.x;
        y = self.y + vector.y;

        return new game.Vector2(x,y);
    };

    this.subtract = function(vector) {
        var x, y;

        x = self.x - vector.x;
        y = self.y - vector.y;

        return new game.Vector2(x,y);
    };

    this.scale = function(scalar) {
        var x, y;

        x = self.x * scalar;
        y = self.x * scalar;

        return new game.Vector2(x,y);
    };
};