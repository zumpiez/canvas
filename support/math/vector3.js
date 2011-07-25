(function () {
    // todo: we need a common lib for this!
    function degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    Cale.Vector3 = function(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    };

    // convert a matrix array into a vector (MAKES MAJOR ASSUMPTIONS)
    Cale.Vector3.fromArray = function (array) {
        return new Cale.Vector3({
            x: array[0][0],
            y: array[1][0],
            z: array[2][0]
        });
    };

    //add two vectors, immutable style
    Cale.Vector3.prototype.add = function(vector) {
        var x, y, z;

        x = this.x + vector.x;
        y = this.y + vector.y;
        z = this.z + vector.z;

        return new Cale.Vector3(x,y,z);
    };

    //subtract two vectors, immutable style
    Cale.Vector3.prototype.subtract = function(vector) {
        var x, y, z;

        x = this.x - vector.x;
        y = this.y - vector.y;
        z = this.z - vectcor.z;

        return new Cale.Vector3(x,y,z);
    };

    //scale a vector by a scalar amount, immutable style
    Cale.Vector3.prototype.scale = function(scalar) {
        var x, y, z;

        x = this.x * scalar;
        y = this.x * scalar;
        z = this.z * scalar;

        return new Cale.Vector3(x,y,z);
    };

    // calculate the magnitude of a vector
    Cale.Vector3.prototype.magnitude = function () {
        return Math.sqrt((this.x * this.x) + (this.y * this.y) +
            (this.z * this.z));
    };

    // return an array representing this vector as an array matrix
    Cale.Vector3.prototype.toArray = function () {
        return [[this.x], [this.y], [this.z]];
    };
}());