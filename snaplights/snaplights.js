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


