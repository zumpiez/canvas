require(["component"], function () {
    // this must exist!
    Cale.namespace("Cale.Components");

    Cale.Components.Drawable = function (image) {
        Cale.inherit(this, Cale.Component);
        this.image = image;
    };

    Cale.inherit(Cale.Components.Drawable, Cale.Component);

    Cale.Components.Drawable.prototype.initialize = function () {
        // make sure that draw is forwarded
        this.parent.forward("draw");

        this.subscribe("draw", function (graphics) {
            var context, translation;
            context = graphics.context();
            translation = this.parent.translation;
            context.drawImage(this.image, translation.x, translation.y);
        });
    };
});