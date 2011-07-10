var game = {}; //global namespace

var context = document.getElementById("canvas").getContext("2d");
if(!!context) {
	context.fillRect(0,0,512,512);
}