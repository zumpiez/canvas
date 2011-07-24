Cale.require(["support/math/vector2", "engine/component"], function () {
    Cale.Entity = function (options) {
        options = options || {};

        this.topics = {};
        this.id = 0;
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
        var token = false;
        // if callback is a function then we can proceed
        if (Cale.isFunction(callback)) {
            // generate the unique subscriber token
            token = (+new Date() * 100) + (this.id % 100);
            // increment id (unique subscriber id)
            this.id += 1;
            // if no subscribers exist for this topic then create the
            // topic and corresponding subscribers array
            if (!this.topics.hasOwnProperty(topic)) {
                this.topics[topic] = [];
            }
            // add this subscriber to the topic topics
            this.topics[topic].push({
                token: token,
                callback: callback
            });
        }
        // return the unique subscriber token if callback is a function
        // and false otherwise (indicating a failure)
        return token;
    };

    // unsubscribe
    Cale.Entity.prototype.unsubscribe = function (token) {
        // iterate over the subscribers across all topics and return
        // the result of the iteration (as a false return value will
        // cause us to break from the loop indicating success)
        return !Cale.each(this.topics, function (subscribers) {
            // iterate over the subribers in a single topic and return
            // the result of the iteration (as a false return value will
            // cause us to break from the loop indicating success)
            return Cale.each(subscribers, function (subscriber, index) {
                // if this is the subscriber wishing to unsubscribe
                if (token === subscriber.token) {
                    // remove them from the array of subscribers
                    subscribers.splice(index, 1);
                    // return false to exit the loop
                    return false;
                }
            });
        });
    };

    // publish
    Cale.Entity.prototype.publish = function (topic, message) {
        // if no subscribers exist for this topic then forego work
        if (!this.topics.hasOwnProperty(topic)) {
            return false;
        } else {
            // iterate over the subscribers in the topic
            Cale.each(this.topics[topic], function (subscriber) {
                // notify the current subscriber
                subscriber.callback(message);
            });
            return true;
        }
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
    }

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