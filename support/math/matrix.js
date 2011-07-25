Cale.require("support/math/math", function () {
    // hardcode to four for now
    var ROWS = 3, COLUMNS = 3;

    Cale.Matrix = function (options) {
        var row, column, subscript;

        options = options || {};

        if (Cale.isObject(options)) {

            this.rows = options.rows || ROWS;
            this.columns = options.columns || COLUMNS;

            for (row = 1; row <= this.rows; row++) {
                for (column = 1; column <= this.columns; column++) {
                    subscript = "m" + row + column;
                    this[subscript] = options[subscript] || 0;
                }
            }
        } else if (Cale.isArray(options)) {

            this.rows = options.length;
            this.columns = options[0].length;

            for (row = 0; row < this.rows; row++) {
                for (column = 0; column < this.columns; column++) {
                    subscript = "m" + (row + 1) + (column + 1);
                    this[subscript] = options[row][column];
                }
            }
        }
    };

    Cale.Matrix.fromArray = function (array) {
        return new Cale.Matrix(array);
    };

    // 3x3 zero matrix
    Cale.Matrix.zero = function () {
        return new Cale.Matrix();
    };

    // 3x3 identity matrix
    Cale.Matrix.identity = function () {
        return new Cale.Matrix({
            m11: 1,
            m22: 1,
            m33: 1
        });
    };

    // create a 3x3 translation matrix
    Cale.Matrix.createTranslation = function (vector) {
        var translation = Cale.Matrix.identity();

        vector = vector || {};

        translation.m13 = vector.x || 0;
        translation.m23 = vector.y || 0;

        return translation;
    };

    // rotate a 3x3 matrix by an angle
    Cale.Matrix.createRotation = function (degrees) {
        var radians, cos, sin;

        radians = Cale.Math.degreesToRadians(degrees);

        cos = Math.cos(radians);
        sin = Math.sin(radians);

        return new Cale.Matrix({
            m11: cos,
            m12: sin * -1,
            m21: sin,
            m22: cos,
            m33: 1
        });
    };

    // add two matrices, immutable style
    Cale.Matrix.prototype.add = function (matrix) {
        var row, column, subscript, result = {};

        for (row = 1; row <= this.rows; row++) {
            for (column = 1; column <= this.columns; column++) {
                subscript = "m" + row + column;
                result[subscript] = this[subscript] + matrix[subscript];
            }
        }

        return new Cale.Matrix(result);
    };

    // subtract two matrices, immutable style
    Cale.Matrix.prototype.subtract = function (matrix) {
        var row, column, subscript, result = {};

        for (row = 1; row <= this.rows; row++) {
            for (column = 1; column <= this.columns; column++) {
                subscript = "m" + row + column;
                result[subscript] = this[subscript] - matrix[subscript];
            }
        }

        return new Cale.Matrix(result);
    };

    // scale a matrix by a scalar amount, immutable style
    Cale.Matrix.prototype.scale = function (scalar) {
        var row, column, subscript, result = {};

        for (row = 1; row <= this.rows; row++) {
            for (column = 1; column <= this.columns; column++) {
                subscript = "m" + row + column;
                result[subscript] = this[subscript] * scalar;
            }
        }

        return new Cale.Matrix(result);
    };

    // multiply two matrices together
    Cale.Matrix.prototype.multiply = function (matrix) {
        var i, j, k, m, n, p, a, b, s, c = [];

        a = this.toArray();

        if (Cale.isArray(matrix)) {
            b = matrix;
        } else if (Cale.isFunction(matrix.toArray)) {
            b = matrix.toArray();
        }

        m = a.length;
        n = b.length;
        p = b[0].length;

        for (j = 0; j < p; j++) {
            for (i = 0; i < m; i++) {
                s = 0;
                for (k = 0; k < n; k++) {
                    s += a[i][k] * b[k][j];
                }
                c[i] = c[i] || [];
                c[i][j] = s;
            }
        }

        return new Cale.Matrix(c);
    };

    // return an array representing this matrix as an array
    Cale.Matrix.prototype.toArray = function () {
        var row, column, subscript, array = [];

        for (row = 0; row < this.rows; row++) {
            array[row] = [];
            for (column = 0; column < this.columns; column++) {
                subscript = "m" + (row + 1) + (column + 1);
                array[row][column] = this[subscript];
            }
        }

        return array;
    };
});