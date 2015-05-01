getEulerAngles = function(q){
	return {
		roll : Math.atan2(2.0*(q.y*q.z + q.w*q.x), q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z),
		pitch : Math.asin(-2.0*(q.x*q.z - q.w*q.y)),
		yaw : Math.atan2(2.0*(q.x*q.y + q.w*q.z), q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z)
	}
}

var prevYaw = 0;
var prevRoll = 0;

baseline = -1;

lastThree = [0,0,0];

hasLowPeak = function(){
	return lastThree[0] > lastThree[1] && lastThree[1] < lastThree[2] && lastThree[1] < 0;
}

hasHighPeak = function(){
	return lastThree[0] < lastThree[1] && lastThree[1] > lastThree[2] && lastThree[1] > 1;;
}

Myo.on('orientation', function(quanternion){
	var angles = getEulerAngles(quanternion);


	lastThree.shift();
	lastThree.push(angles.roll);

	if(hasHighPeak()) console.log('HIGH');
	if(hasLowPeak()) console.log('LOW');

	if(prevYaw < -1 && angles.yaw > 1) this.trigger('push_up')
	if(prevYaw > 1 && angles.yaw < -1) this.trigger('push_down')
	prevYaw = angles.yaw;

	if(prevRoll < -1 && angles.roll > 1) this.trigger('push_up')
	if(prevRoll > 1 && angles.roll < -1) this.trigger('push_down')
	prevRoll = angles.roll;



})