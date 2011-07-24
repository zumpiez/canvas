// require input and component
Cale.require(["system/input", "engine/component"], function () {
    // define the input component
    Cale.InputComponent = function() {
        // continue the inheritance
        Cale.inherit(this, Cale.Component);
        // override the receive function of component
        this.keyboard = Cale.Input.Keyboard.getInstance();
        this.receive = function (message) {
            // sanitize message a bit
            message = message || {};
            // verify that we are the intended recipient
            if (message.type === "input") {
                // call update with the container, and keyboard
                this.update(this.container(), keyboard);
                return true;
            }
            return false;
        };
    };
});