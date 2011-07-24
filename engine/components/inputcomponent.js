// require input and component
Cale.require(["system/input", "engine/component"], function () {
    // define the input component
    Cale.InputComponent = function() {
        // continue the inheritance
        Cale.inherit(this, Cale.Component);
    };

    Cale.InputComponent.prototype.keyboard = Cale.Input.Keyboard.getInstance;
});