var myo = Myo.create();

myo.on('connected', function(){
	myo.streamEMG(true);
})


var getDummyData = function(){
	return _.times(500, function(index){
		return 0
	});
}

var data = {
	emg : getDummyData(),
	movingAverage : getDummyData(),
	ema : getDummyData(),

	movingAverage2 : getDummyData(),

	cond : getDummyData(),
};


var genData = function(){
	return _.map(data, function(vals, key){
		return {
			label : key,
			data : _.map(vals, function(d, index){
				return [index, d]
			})
		}
	})
}

/*
var graph = $.plot('#plot', genData(),{
	series: {shadowSize: 0},
	//colors: [ '#04fbec', '#c14b2a', '#ebf1be', '#8aceb5'],
	colors: [ 'black', 'black', 'black', '#8aceb5', '#c14b2a'],
	yaxis : {
		min : 0,
		max : 50
	}
});

*/

var context = new window.AudioContext();

var osc = context.createOscillator();
osc.frequency.value = 0;
osc.connect(context.destination);
osc.start(0);


//osc.type = "sawtooth";
//osc.type = "square";













/*
var gain = context.createGain();
gain.gain.value = 100;
gain.connect(osc.frequency);

var osc2 = context.createOscillator();
osc2.frequency.value = 1;
osc2.connect(gain);
osc2.start(0);
*/

var oldValue = 0;

var alpha = 0.3

var t = 0;


myo.on('emg', function(emg){
	//console.log(emg);

	var average = _.reduce(emg, function(r, pod){
		return r + pod;
	},0)/emg.length;

	if(average < 0) average *= -1

	if(average < 5) average = 0;

	//console.log(average);

	data.emg.shift();
	data.emg.push(average);

	var newValue = oldValue + alpha * (average - oldValue);

	data.ema.shift();
	data.ema.push(newValue);



	var movingAverage = 0;
	_.times(5, function(index){
		movingAverage += data.emg[data.emg.length - (index + 1)]
	})
	movingAverage = movingAverage/5
	data.movingAverage.shift();
	data.movingAverage.push(movingAverage);





	if(average > t){
		t = average;
	}else{
		t -= 1;
	}
	if(t<0) t=0;

	data.cond.shift();
	data.cond.push(t);


	var movingAverage2 = 0;
	_.times(15, function(index){
		movingAverage2 += data.cond[data.emg.length - (index + 1)]
	})
	movingAverage2 = movingAverage2/15
	data.movingAverage2.shift();
	data.movingAverage2.push(movingAverage2);





	osc.frequency.value = 500 * (movingAverage2)/30


	//$('#puppet').height(300 * (movingAverage2)/30);

	var val = movingAverage2/50;

	if(val < 0.2) val = -0.08;

	nMouthOpen = val;


	console.log(val);


/*
	graph.setData(genData());
	graph.draw();
	*/
})