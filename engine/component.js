// abstract class (essentially)
Cale.Component = function () {
    var container = null;
    // get or set parent container
    this.container = function (c) {
        if (!!c) {
            // change the container value
            container = c;
            // return this for chaining
            return this;
        } else {
            // return the value of container
            return container;
        }
    };
};

// virtual method
Cale.Component.prototype.receive = function (message) {
    // for the chaining
    return this;
};