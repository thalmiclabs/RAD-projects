var THALMIC_HUB = "22a828f1898a4257c3f181e7532413345"

var myo = Myo.create();
var datLight;

//I wrote a much easier JS API for Hue lights for CES, just using it here :)
hue.discover(THALMIC_HUB);
hue.ready(function(){
	console.log('Hue lights are ready!');
	datLight = hue.lights[4];

	// Uses a myo.js plugin to detect snap I wrote
	myo.on('snap', function(){
		datLight.toggle()
	})

});


