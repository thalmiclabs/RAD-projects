var myo = Myo.create();

myo.on('pushup', function(){
	console.log('PUSHUP');
});


getEulerAngles = function(q){
	return {
		roll : Math.atan2(2.0*(q.y*q.z + q.w*q.x), q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z),
		pitch : Math.asin(-2.0*(q.x*q.z - q.w*q.y)),
		yaw : Math.atan2(2.0*(q.x*q.y + q.w*q.z), q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z)
	}
}


var getDummyData = function(){
	return _.times(500, function(index){
		return 0
	});
}

var data = {
	x : getDummyData(),
	y : getDummyData(),
	z : getDummyData()
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

var graph = $.plot('#plot', genData(),{
	series: {shadowSize: 0},
	colors: [ '#04fbec', '#ebf1be', '#c14b2a', '#8aceb5'],
	/*yaxis : {
		min : -3,
		max : 3
	},*/
});

var addData = function(angles){

	//console.log(angles);

	data.x.shift();
	data.y.shift();
	data.z.shift();

	var x = Math.cos(angles.yaw) * Math.cos(angles.pitch)
	var y = Math.sin(angles.yaw) * Math.cos(angles.pitch)
	var z = Math.sin(angles.pitch)

	data.x.push(Math.cos(angles.yaw) * Math.cos(angles.pitch))
	data.y.push(Math.sin(angles.yaw) * Math.cos(angles.pitch))
	data.z.push(Math.sin(angles.pitch))



}


myo.on('vector', function(coords){
	$('#x').width(300 + -300*coords[0]);
	$('#y').height(300 + 300*coords[1]);
})


var prevVal = 0;


myo.on('orientation', function(o){
	var ea = getEulerAngles(o)

	addData(ea);
	graph.setData(genData());
	graph.draw();

	$('#roll').text(ea.roll);

});

myo.on('fist', function(){
	myo.zeroOrientation();
})

myo.on('grid', function(grid){

	$('.grid').removeClass('show');

	var gridNumber = 0;
	if(grid.band === 'upper') gridNumber = 1;
	if(grid.band === 'center') gridNumber = 4;
	if(grid.band === 'lower') gridNumber = 7;

	if(grid.side === 'left') gridNumber += 0;
	if(grid.side === 'center') gridNumber += 1;
	if(grid.side === 'right') gridNumber += 2;



	$('#grid' + gridNumber).addClass('show');

})