getEulerAngles = function(q){
	return {
		roll : Math.atan2(2.0*(q.y*q.z + q.w*q.x), q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z),
		pitch : Math.asin(-2.0*(q.x*q.z - q.w*q.y)),
		yaw : Math.atan2(2.0*(q.x*q.y + q.w*q.z), q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z)
	}
}

Myo.on('orientation', function(quanternion){
	var angles = getEulerAngles(quanternion);
	var x = Math.sin(angles.yaw) * Math.cos(angles.pitch)
	var y = Math.sin(angles.pitch)
	this.trigger('vector', [x,y]);
})



var gridSize = 0.2;
Myo.on('vector', function(coords){

	var x = coords[0];
	var y = coords[1];

	var getSide = function(x){
		if(x < -gridSize) return 'right';
		if(x > gridSize) return 'left';
		return 'center';
	}

	var getBand = function(y){
		if(y < -gridSize) return 'upper';
		if(y > gridSize) return 'lower';
		return 'center';
	}

	this.trigger('grid', {
		band : getBand(y),
		side : getSide(x)
	});

})