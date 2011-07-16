// abstract class (essentially)
Cale.Component = function () {

};

// virtual method
Cale.Component.prototype.receive = function (message) {
    // for the chaining
    return this;
};