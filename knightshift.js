require(["cale"], function() {
    require.ready(function() {
        var game = new Cale.Game({
            canvasContainer: document.getElementById("game"),
            draw: function () {
                var world = this.world(), graphics = this.graphics();
                world.publish("draw", graphics);
            },
            update: function (gametime) {
            }
        });

        var world = game.world();

        var brick = new Cale.Entity({
            translation: {
                x: 0,
                y: 0
            }
        });

        world.addEntity(brick);

        var brickImage = new Image();
        brickImage.src = "images/brick.png";

        var brickDrawableComponent = new Cale.Components.Drawable(brickImage);

        brick.addComponent(brickDrawableComponent);
        
        Cale.on("start", "click", function () {
            game.start();
        });
        
        Cale.on("stop", "click", function () {
            game.stop();
        });
    });
});