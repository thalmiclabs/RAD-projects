/**
 * Copyright 2015 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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