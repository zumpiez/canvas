(function () {

    // a map that will store the loaded files, and DOM position
    var loaded = {}, lastScript;

    // create the require function
    Cale.require = function (requirement, callback) {
        var script = null, file = "" + requirement, head;
        // if we haven't loaded this requirement then we need to do so
        if (!loaded.hasOwnProperty(requirement)) {
            // create a script element
            script = document.createElement("script");
            // add the type attribute as it is required in HTML<5
            script.setAttribute("type", "text/javascript");
            // check to see if the file extension is supplied
            if (file.search(/\.js$/) === -1) {
                // add it if it wasn't
                file += ".js";
            }
            // add the src attribute with the file
            script.setAttribute("src", file);
            // get the head tag (assume it is there)
            head = document.getElementsByTagName("head")[0];
            // if this is the first script insert it as the first
            // child, otherwise insert it as the next child (which
            // can potentially be the last)
            lastScript = head.insertBefore(script, (!lastScript) ?
                head.firstChild : lastScript.nextSibling);
            // register that the script has been loaded
            loaded[file] = true;
        }
        // if a callback has been defined and it is a function then we
        // need to invoke that sucker
        if (typeof callback === "function") {
            callback.call();
        }
    };

}());