(function () {
    // hardcode to four for now
    var ROWS = 4, COLUMNS = 4;

    // todo: create a new math library with this in it
    function degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    Cale.Matrix = function (options) {
        var row, column, subscript;

        options = options || {};

        for (row = 1; row <= ROWS; row++) {
            for (column = 1; column <= COLUMNS; column++) {
                subscript = "m" + row + column;
                this[subscript] = options[subscript] || 0;
            }
        }
    };

    // zero matrix
    Cale.Matrix.zero = function () {
        return new Cale.Matrix();
    };

    // identity matrix
    Cale.Matrix.identity = function () {
        return new Cale.Matrix({
            m11: 1,
            m22: 1,
            m33: 1,
            m44: 1
        });
    };

    // create a translation matrix
    Cale.Matrix.createTranslation = function (vector) {
        var translation = Cale.Matrix.identity();

        vector = vector || {};

        translation.m14 = vector.x || 0;
        translation.m24 = vector.y || 0;
        translation.m34 = vector.z || 0;

        return translation;
    };

    // create a rotation matrix around the x-axis
    Cale.Matrix.createRotationX = function (degrees) {
        var radians, cos, sin;

        radians = degreesToRadians(degrees);

        cos = Math.cos(radians);
        sin = Math.sin(radians);

        return new Cale.Matrix({
            m11: 1,
            m22: cos,
            m23: sin * -1,
            m32: sin,
            m33: cos,
            m44: 1
        });
    };

    // create a rotation matrix around the y-axis
    Cale.Matrix.createRotationY = function (degrees) {
        var radians, cos, sin;

        radians = degreesToRadians(degrees);

        cos = Math.cos(radians);
        sin = Math.sin(radians);

        return new Cale.Matrix({
            m11: cos,
            m13: sin,
            m22: 1,
            m31: sin * -1,
            m33: cos,
            m44: 1
        });
    };

    // create a rotation matrix around the z-axis
    Cale.Matrix.createRotationZ = function (degrees) {
        var radians, cos, sin;

        radians = degreesToRadians(degrees);

        cos = Math.cos(radians);
        sin = Math.sin(radians);

        return new Cale.Matrix({
            m11: cos,
            m12: sin * -1,
            m21: sin,
            m22: cos,
            m33: 1,
            m44: 1
        });
    };

    // create a scaling matrix
    Cale.Matrix.createScale = function (scalar) {
        scalar = scalar || 0;

        return new Cale.Matrix({
            m11: scalar,
            m22: scalar,
            m33: scalar,
            m44: 1
        });
    };

    // add two matrices, immutable style
    Cale.Matrix.prototype.add = function (matrix) {
        var row, column, subscript, result = {};

        for (row = 1; row <= ROWS; row++) {
            for (column = 1; column <= COLUMNS; column++) {
                subscript = "m" + row + column;
                result[subscript] = this[subscript] + matrix[subscript];
            }
        }

        return new Cale.Matrix(result);
    };

    // subtract two matrices, immutable style
    Cale.Matrix.prototype.subtract = function (matrix) {
        var row, column, subscript, result = {};

        for (row = 1; row <= ROWS; row++) {
            for (column = 1; column <= COLUMNS; column++) {
                subscript = "m" + row + column;
                result[subscript] = this[subscript] - matrix[subscript];
            }
        }

        return new Cale.Matrix(result);
    };

    // scale a matrix by a scalar amount, immutable style
    Cale.Matrix.prototype.scale = function (scalar) {
        var row, column, subscript, result = {};

        for (row = 1; row <= ROWS; row++) {
            for (column = 1; column <= COLUMNS; column++) {
                subscript = "m" + row + column;
                result[subscript] = this[subscript] * scalar;
            }
        }

        return new Cale.Matrix(result);
    };
}());