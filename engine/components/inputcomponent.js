Cale.require(["system/input", "engine/component"], function () {
    var keyboard = Cale.Input.Keyboard.getInstance();

    Cale.inherit(Cale.InputComponent, Cale.Component);

    Cale.InputComponent = function() {
        Cale.inherit(this, Cale.Component);

        this.receive = function (message) {
            message = message || {};
            if (message.type === "input") {
                this.update(this.container(), keyboard);
                return true;
            }
            return false;
        };
    };

    Cale.InputComponent.prototype.update = function (container, keyboard) {

    };
});