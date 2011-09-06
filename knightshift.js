require(["cale"], function() {
    require.ready(function() {
        var game = new Cale.Game({
            canvasContainer: document.getElementById("game"),
            draw: function () {
            },
            update: function (gametime) {
            }
        });
        
        Cale.on("start", "click", function () {
            game.start();
        });
        
        Cale.on("stop", "click", function () {
            game.stop();
        });
    });
});