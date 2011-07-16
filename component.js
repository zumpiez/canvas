// abstract class (essentially)
function Component() {

}

// virtual method
Component.prototype.receive = function (message) {
    // for the chaining
    return this;
};