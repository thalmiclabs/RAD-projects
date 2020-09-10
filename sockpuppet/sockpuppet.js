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

var myo = Myo.create();

myo.on('connected', function(){
	myo.streamEMG(true);
})

var setupSound = function(){
	var context = new window.AudioContext();

	osc = context.createOscillator();
	osc.frequency.value = 0;
	osc.connect(context.destination);
	osc.start(0);
}()


var sawtoothWave = _.times(15, function(){ return 0});

myo.on('emg', function(emg){

	//Normalize the EMG data and cut out some noise
	var emgAverage = _.reduce(emg, function(r, pod){
		return r + pod;
	},0)/emg.length;
	if(emgAverage < 0) emgAverage *= -1
	if(emgAverage < 5) emgAverage = 0;


	//Produces a fast rise, slow fall, sawtooth-like dataset from the EMG data
	var lastVal = _.last(sawtoothWave);
	if(emgAverage > lastVal){
		lastVal = emgAverage;
	}else{
		lastVal -= 1;
	}
	if(lastVal<0) lastVal=0;
	sawtoothWave.shift();
	sawtoothWave.push(lastVal);


	//Smooths the spikey-ness into something we can use
	var smoothedAverage = _.reduce(sawtoothWave, function(r, val){
		return r + val;
	}, 0)/sawtoothWave.length;

	this.trigger('puppet_mouth', smoothedAverage);

})

myo.on('puppet_mouth', function(val){
	//Using the puppet mouth with some tweak variables to get the desired effect
	osc.frequency.value = 500/30 * val;

	if(val/50 < 0.2){
		nMouthOpen = -0.08
	}else{
		nMouthOpen = val/50;
	}
})