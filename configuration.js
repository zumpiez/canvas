(function () {
    Cale.Configuration = {
        includes: [
            {
                system: [
                    "input",
                    "sound",
                    "graphics"
                ]
            },
            {
                engine: [
                    "component",
                    "entity",
                    "camera",
                    "game",
                    { components: ["inputcomponent"] }
                ]
            }
        ]
    };
}());