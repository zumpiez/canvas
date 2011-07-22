Cale.require(["vector2", "component"], function () {
    Cale.Entity = function (options) {
        // private variable for storing components, entity children
        var components = [], children = [];

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
            // iterate over the components and return true when the component
            // has been removed
            return !Cale.each(components, function (candidate, index) {
                // is this the right component to remove?
                if (component === candidate) {
                    // get it out of here
                    components.splice(index, 1);
                    // break out of the each
                    return false;
                }
            });
        };

        // remove all components
        this.removeAllComponents = function () {
            // kill all components
            components = [];
            // for the chaining
            return this;
        };

        this.addChild = function (child) {
            // set the parent of the child to this
            child.parent = this;
            // add the child to the list of children
            children.push(child);
            // for the chaining
            return this;
        };

        this.removeChild = function (child) {
            // iterate over the children and return true when the child has
            // been removed
            return !Cale.each(children, function (candidate, index) {
                // is this the right child to remove?
                if (candidate === child) {
                    // remove the child
                    children.splice(index, 1);
                    // break out of the each
                    return false;
                }
            });
        };

        this.removeAllChildren = function () {
            // kill all the children
            children = [];
            // for the chaining
            return this;
        };

        // send a message to the components
        this.send = function (message, propogate) {
            // iterate over the components
            Cale.each(components, function (component) {
                // notify
                component.receive(message);
            });
            // if we should propogate to the entity children
            if (!!propogate) {
                // iterate over the children
                Cale.each(children, function (child) {
                    // notify
                    child.send(message);
                });
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
});