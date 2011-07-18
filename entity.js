Cale.require("vector2");
Cale.require("component");

Cale.Entity = function (options) {
    // private variable for storing components
    var components = [];

    options = options || {};

    if (!!options.translation) {
        this.translation = options.translation;
    } else if (!!options.x || !!options.y) {
        this.translation = new Cale.Vector2(options.x, options.y);
    } else {
        this.translation = Cale.Vector2.zero();
    }

     // add a component
    this.addComponent = function (component) {
        // set the container of the component to this
        component.container = this;
        // add the component to the list
        components.push(component);
        // for the chaining
        return this;
    };

    // remove a component
    this.removeComponent = function (component) {
        var length = components.length;
        // iterate over the components
        while (length--) {
            // is this the right component to remove?
            if (component === components[length]) {
                // get it out of here
                components.splice(length, 1);
                // we removed it
                return true;
            }
        }
        // we didn't remove it
        return false;
    };

    // remove all components
    this.removeAllComponents = function () {
        // kill all components
        components = [];
        // for the chaining
        return this;
    };

    // send a message to the components
    this.send = function (message) {
        var length = components.length;
        // iterate over the components
        while (length--) {
            // notify
            components[length].receive(message);
        }
        // for the chaining
        return this;
    };
};

Cale.Entity.prototype.update = function (gametime) {
    return this;
};

Cale.Entity.prototype.draw = function (graphics) {
    return this;
};