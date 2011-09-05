// require input and component
require(["input", "component"], function () {
    // define the input component
    Cale.InputComponent = function() {
        // continue the inheritance
        Cale.inherit(this, Cale.Component);
    };

    Cale.inherit(Cale.InputComponent, Cale.Component);

    Cale.InputComponent.prototype.keyboard = Cale.Input.Keyboard.getInstance;
});