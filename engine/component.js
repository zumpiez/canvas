// abstract class (essentially)
Cale.Component = function () {
    //override me.
};

Cale.Component.prototype.initialize = function() {
    //override me.
};

// publish to parent topic
Cale.Component.prototype.publish = function (options) {
    var topic, message;

    if (!!this.parent) {
        options = options || {};

        if (arguments.length > 1) {
            topic = options;
            message = arguments[1];
        } else {
            topic = options.topic;
            message = options.message;
        }

        this.parent.publish(topic, message);
    }

    return this;
};

// subscribe to parent topic
Cale.Component.prototype.subscribe = function (options) {
    var scope = this, topic, callback;

    if (!!this.parent) {
        options = options || {};

        if (arguments.length > 1) {
            topic = options;
            callback = arguments[1];
            if (arguments.length > 2) {
                scope = arguments[2];
            }
        } else {
            topic = options.topic;
            callback = options.callback;
            scope = options.scope || scope;
        }

        this.parent.subscribe(topic, function (message) {
            callback.call(scope, message);
        });
    }

    return this;
};

Cale.Component.create = function (options) {
    var component = new Cale.Component();
    if (Cale.isObject(options) || Cale.isFunction(options)) {
        Cale.augment(component, options);
    }
    return component;
};