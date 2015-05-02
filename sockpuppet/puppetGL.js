/**
 * Taken from http://www.mediosyproyectos.com/puppetic/
 *
 */


var CLOSED = -0.08;

var mouthOpen = 0;
var nMouthOpen = CLOSED;
var eyeBrownOff = 0;
var nEyeBrownOff = 0;
var nEyeBrownOffL = 0;
var nEyeBrownOffR = 0;
var eyeBrownOnlyOne = false;

var closedEyes = false;

var modeAuto = true;

var input = new InputManager();

var mouse = new Mouse();

window.onload = function() {

	var scene = new THREE.Scene();

	var projector = new THREE.Projector();

	var dae;

	// Camera
	var camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 1, 1000);

	var renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setClearColor( 0x000000, 0 );
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera.position.y = 15;
	camera.position.z = 70;

	var ambientLight = new THREE.AmbientLight(0xFFFFFF);
	scene.add(ambientLight);

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.3);
	directionalLight.position.set( 0, 0, 1 );
	scene.add( directionalLight );

	var oJaw, oPalate, oShoulders, oEyeL, oEyeR, oEyeBrowL, oEyeBrowR, osEyes;
	var eyeL, eyeR, eyeBrowL, eyeBrowR;
	var joint1, jointNeck, jointShoulders;

	var EYEBROWN_INIT_ROTATION = 0.05;

	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;

	var lastKey = 0;

	var bones = [];

	loader.load('sockpuppet.dae' , function ( collada ) {

	    dae = collada.scene;
	    skin = collada.skins[ 0 ];

	    dae.rotation.set( Math.PI / 9,  Math.PI / 4, 0 );
	    dae.updateMatrix();

	    dae.scale.x = dae.scale.y = dae.scale.z = 2;

	    for (var i = 0; i < skin.skeleton.bones.length; ++i) {

	    	bones[skin.skeleton.bones[i].name] = skin.skeleton.bones[i];
	    }

	    oJaw = bones.jointJaw.rotation.clone();
	    oPalate = bones.jointPalate.rotation.clone();
	    oShoulders = bones.jointShoulders.rotation.clone();

	    scene.add( dae );

	    eyeL = scene.getObjectByName( "eyeL", true ).children[0];
	    eyeR = scene.getObjectByName( "eyeR", true ).children[0];
	    eyeBrowL = scene.getObjectByName( "eyeBrowL", true ).children[0];
	    eyeBrowR = scene.getObjectByName( "eyeBrowR", true ).children[0];

	    oEyeL = eyeL.position.clone();
	    oEyeR = eyeR.position.clone();
	    oEyeBrowL = eyeL.position.clone();
	    oEyeBrowR = eyeR.position.clone();

	    osEyes = eyeL.scale.x;

	    eyeBrowL.rotation.y = -EYEBROWN_INIT_ROTATION;
	    eyeBrowR.rotation.y = EYEBROWN_INIT_ROTATION;

	    for (var i = 0; i < dae.children.length; ++i) {
	    	if (dae.children[i].name == "joint1") joint1 = dae.children[i];
	    }

	    jointNeck = joint1.getObjectByName( "jointNeck", true );
	    jointShoulders = joint1.getObjectByName( "jointShoulders", true );

	    eyeL.material.transparent = true;
	    eyeR.material.transparent = true;

	    render();
	    blinkLoop();
	});

	window.addEventListener('keydown', function(ev){

		if (modeAuto) return;

		if (ev.which == lastKey) return;

		switch (ev.which) {

			case KeyCode.N1:
				nMouthOpen = -0.12;
				break;
			case KeyCode.N5:
				nMouthOpen = 0.25 + Math.random() * 0.5;
				break;
			case KeyCode.N4:
				nMouthOpen = 0.1 + Math.random() * 0.15;
				break;
			case KeyCode.N3:
				nMouthOpen = 0.05 + Math.random() * 0.1;
				break;
			case KeyCode.N2:
				nMouthOpen = 0.02 + Math.random() * 0.05;
				break;
			case KeyCode.Space:
				break;
			default:
				nMouthOpen = CLOSED;
		}

		lastKey = ev.which;
	});


	var render = function () {

	    requestAnimationFrame(render);
	    renderer.render(scene, camera);

		var r = 0.4;

		if (input.isKeyDown(KeyCode.Left)) { bones.joint1.rotation.y -= 0.03; }
		if (input.isKeyDown(KeyCode.Right)) { bones.joint1.rotation.y += 0.03; }

		if (input.isKeyDown(KeyCode.B)) { r = 0.1; }

		mouthOpen -= (mouthOpen - nMouthOpen) * r;

	    bones.jointJaw.rotation.z = oJaw.z - mouthOpen;
	    bones.jointPalate.rotation.z = oPalate.z + mouthOpen;

		bones.jointNeck.rotation.x = mouse.cX * 2;
		bones.jointNeck.rotation.z = mouse.cY * 2;
		bones.jointNeck.rotation.y = -mouse.cX * 1;

		bones.jointShoulders.rotation.x = mouse.cX * 1;
		bones.jointShoulders.rotation.z = mouse.cY * 1;
		bones.jointShoulders.rotation.y = -mouse.cX * 1;

		var eyeV = mouse.cY * 8;
		var eyeH = mouse.cX * 8;

		eyeV = (eyeV > 0.8) ? 0.8 : eyeV;
		eyeV = (eyeV < -0.8) ? -0.8 : eyeV;
		eyeH = (eyeH > 0.8) ? 0.8 : eyeH;
		eyeH = (eyeH < -0.8) ? -0.8 : eyeH;

		eyeL.position.z = oEyeL.z + eyeH;
		eyeL.position.x = oEyeL.x - eyeV;
		eyeR.position.z = oEyeR.z + eyeH;
		eyeR.position.x = oEyeR.x - eyeV;


		//Solo una ceja o las dos
		if (eyeBrownOnlyOne) {
			nEyeBrownOffL -= (nEyeBrownOffL - eyeBrownOff) * 0.5;
			nEyeBrownOffR = EYEBROWN_INIT_ROTATION - nEyeBrownOffL * 0.3;
		} else {
			nEyeBrownOffL -= (nEyeBrownOffL - eyeBrownOff) * 0.5;
			nEyeBrownOffR = nEyeBrownOffL;
		}

		if (input.isKeyDown(KeyCode.Space)) {
			eyeL.scale.x = eyeR.scale.x = 0.1;
			closedEyes = true;
		} else {
			if (closedEyes) {
				eyeL.scale.x = eyeR.scale.x = osEyes;
				closedEyes = false;
			}
		}

		eyeBrowL.position.x = oEyeBrowL.x - eyeV * 0.5 - nEyeBrownOffL;
		eyeBrowR.position.x = oEyeBrowR.x - eyeV * 0.5 - nEyeBrownOffR;

		eyeBrowL.rotation.y = nEyeBrownOffL;
		eyeBrowR.rotation.y = -nEyeBrownOffR;

		jointNeck.rotation.copy(bones.jointNeck.rotation);
		jointShoulders.rotation.copy(bones.jointShoulders.rotation);
		joint1.rotation.copy(bones.joint1.rotation);

	};

	function blinkLoop() {

		setTimeout(function() {

			if (!closedEyes) eyeL.scale.x = eyeR.scale.x = 0.1;

			setTimeout(function() {
				if (!closedEyes) eyeL.scale.x = eyeR.scale.x = osEyes;
				blinkLoop();
			}, 70);

		}, 1000 + Math.random() * 1500);

	}

	$(window).resize(function() {
		renderer.setSize( window.innerWidth, window.innerHeight );
		camera.aspect	= window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	});
};

/* ------------------------------------------------ KEYBOARD */

KeyCode = {"Backspace":8,"Tab":9,"Enter":13,"Shift":16,"Ctrl":17,"Alt":18,"Pause/Break":19,"Caps Lock":20,"Esc":27,"Space":32,"Page Up":33,"Page Down":34,"End":35,"Home":36,"Left":37,"Up":38,"Right":39,"Down":40,"Insert":45,"Delete":46,"N0":48,"N1":49,"N2":50,"N3":51,"N4":52,"N5":53,"N6":54,"N7":55,"N8":56,"N9":57,"A":65,"B":66,"C":67,"D":68,"E":69,"F":70,"G":71,"H":72,"I":73,"J":74,"K":75,"L":76,"M":77,"N":78,"O":79,"P":80,"Q":81,"R":82,"S":83,"T":84,"U":85,"V":86,"W":87,"X":88,"Y":89,"Z":90,"Windows":91,"Right Click":93,"Numpad 0":96,"Numpad 1":97,"Numpad 2":98,"Numpad 3":99,"Numpad 4":100,"Numpad 5":101,"Numpad 6":102,"Numpad 7":103,"Numpad 8":104,"Numpad 9":105,"Numpad *":106,"Numpad +":107,"Numpad -":109,"Numpad .":110,"Numpad /":111,"F1":112,"F2":113,"F3":114,"F4":115,"F5":116,"F6":117,"F7":118,"F8":119,"F9":120,"F10":121,"F11":122,"F12":123,"Num Lock":144,"Scroll Lock":145,"My Computer":182,"My Calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222};

function InputManager() {
	this.keyState = [];
	this.keyCurrent = [];
	this.keyLast = [];
	var self = this;

	window.addEventListener('keydown', function(ev){
		self.keyCurrent[ev.which] = true;
		self.keyState[ev.which] = true;
	});
	window.addEventListener('keyup', function(ev){
		self.keyCurrent[ev.which] = false;
		self.keyState[ev.which] = false;
	});
}

// call this once per run of the game's logic update (render loop)
InputManager.prototype.update = function(){
this.keyLast = this.keyCurrent;
	this.keyCurrent = this.keyState.slice(0);
};

// test if a key is currently being pressed
InputManager.prototype.isKeyDown = function(key){
	return !!this.keyCurrent[key];
};

// test if a key has been pressed this frame
InputManager.prototype.isKeyTriggered = function(key){
	return !!this.keyCurrent[key] && !this.keyLast[key];
};

// test if a key has been pressed last frame
InputManager.prototype.isKeyReleased = function(key){
	return !this.keyCurrent[key] && !!this.keyLast[key];
};

/* ------------------------------------------------ MOUSE */

function Mouse() {

	this.x = 0;
	this.y = 0;
	this.relX = 0;
	this.relY = 0;
	this.cX = 0;
	this.cY = 0;

	var self = this;

    window.addEventListener('mousemove', function (event) {

    	if (modeAuto) return;

        self.x = event.clientX;
        self.y = event.clientY;

		var screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

		self.relX = self.x / screenWidth;
		self.relY = self.y / screenHeight;

		self.cX = self.relX - 0.5;
		self.cY = self.relY - 0.5;
    });
}

/* ------------------------------------------------ CONTROLS */

$(document).ready(function() {

	var $selectedItem;

	$('.mode-manual').click(function() {
		nMouthOpen = CLOSED;
		eyeBrownOff = 0;
		closedEyes = false;
		eyeBrownOnlyOne = false;
		modeAuto = false;
		showInstructions();
		selectItem($(this));
	});

	$('.mode-wait').click(function() {
		nMouthOpen = CLOSED;
		eyeBrownOff = 0;
		closedEyes = false;
		eyeBrownOnlyOne = false;
		modeAuto = true;

		TweenLite.to(mouse, 0.3, {cX:0, cY:0});
		hideInstructions();
		selectItem($(this));
	});

	$('.mode-surprise').click(function() {
		nMouthOpen = 0.20;
		eyeBrownOff = -0.5;
		closedEyes = false;
		eyeBrownOnlyOne = false;
		modeAuto = true;

		TweenLite.to(mouse, 0.3, {cX:0, cY:-0.05});
		hideInstructions();
		selectItem($(this));
	});

	$('.mode-worry').click(function() {
		nMouthOpen = 0.01;
		eyeBrownOff = -0.5;
		closedEyes = false;
		eyeBrownOnlyOne = false;
		modeAuto = true;

		TweenLite.to(mouse, 0.3, {cX:0.1, cY:0.1});
		hideInstructions();
		selectItem($(this));
	});

	$('.mode-mad').click(function() {
		nMouthOpen = 0.14;
		eyeBrownOff = 0.5;
		closedEyes = false;
		eyeBrownOnlyOne = false;
		modeAuto = true;

		TweenLite.to(mouse, 0.3, {cX:0.12, cY:0});
		hideInstructions();
		selectItem($(this));
	});

	$('.mode-wtf').click(function() {
		nMouthOpen = -0.05;
		eyeBrownOff = 0.5;
		closedEyes = false;
		eyeBrownOnlyOne = true;
		modeAuto = true;

		TweenLite.to(mouse, 0.3, {cX:0.1, cY:0});
		hideInstructions();
		selectItem($(this));
	});

	$('#instructions-wrapper').fadeOut(0);

	function hideInstructions() { $('#instructions-wrapper').fadeOut(300); };
	function showInstructions() { $('#instructions-wrapper').fadeIn(300); };

	function selectItem($item) {

		if ($selectedItem) $selectedItem.removeClass('selected');

		$item.addClass('selected');

		$selectedItem = $item;
	};

	selectItem($('.mode-wait'));
});
