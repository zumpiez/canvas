Cale.require("support/math/vector2", function () {
    Cale.Entity = function (options) {
        options = options || {};

        this.id = 0;
        this.subscribers = [];
        this.components = [];
        this.entities = [];

        if (!!options.translation) {
            this.translation = options.translation;
        } else if (!!options.x || !!options.y) {
            this.translation = new Cale.Vector2(options.x, options.y);
        } else {
            this.translation = Cale.Vector2.zero();
        }
    };

    Cale.Entity.prototype.initialize = function() {
        //override me
    };

    // subscribe
    Cale.Entity.prototype.subscribe = function (topic, callback) {
        var selector = topic, token = false;
        // if callback is a function then we can proceed
        if (Cale.isFunction(callback)) {
            // generate the unique subscriber token
            token = (+new Date() * 100) + (this.id % 100);
            // increment id (unique subscriber id)
            this.id += 1;

            if (typeof topic === "string") {
                selector = new RegExp("^" + topic + "$");
            }

            // add this subscriber to the topic topics
            this.subscribers.push({
                token: token,
                selector: selector,
                callback: callback
            });
        }
        // return the unique subscriber token if callback is a function
        // and false otherwise (indicating a failure)
        return token;
    };

    // unsubscribe
    Cale.Entity.prototype.unsubscribe = function (token) {
        var self = this;

        return !Cale.each(this.subscribers, function (subscription, index) {
            // if this is the subscriber wishing to unsubscribe
            if (token === subscription.token) {
                // remove them from the array of subscribers
                self.subscribers.splice(index, 1);
                // return false to exit the loop
                return false;
            }
        });
    };

    // publish
    Cale.Entity.prototype.publish = function (topic, message) {
        Cale.each(this.subscribers, function (subscription, index) {
            if (subscription.selector.test(topic)) {
                subscription.callback(message, topic);
            }
        });
    };

    // add component
    Cale.Entity.prototype.addComponent = function(component) {
        // todo: type checking?
        this.components.push(component);
        component.parent = this;
        component.initialize();
        return this;
    };

    // add multiple components
    Cale.Entity.prototype.addComponents = function () {
        var index, length = arguments.length;
        for (index = 0; index < length; index++) {
            this.addComponent(arguments[index]);
        }
        return this;
    };

    // add entity
    Cale.Entity.prototype.addEntity = function(entity) {
        // todo: type checking?
        this.entities.push(entity);
        entity.parent = this;
        entity.initialize();
        return this;
    };

    // add multiple entities
    Cale.Entity.prototype.addEntities = function () {
        var index, length = arguments.length;
        for (index = 0; index < length; index++) {
            this.addEntity(arguments[index]);
        }
        return this;
    };
});