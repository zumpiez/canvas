// abstract class (essentially)
Cale.Component = function () {
    //override me.
};

Cale.Component.prototype.initialize = function() {
    //override me.
};

Cale.Component.create = function (options) {
    var component = new Cale.Component();
    if (Cale.isObject(options) || Cale.isFunction(options)) {
        Cale.augment(component, options);
    }
    return component;
};