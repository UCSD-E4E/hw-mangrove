// Custom javascript

var measureData = {
	height: 0,
	altitude: 0,
	ground: 0,
	pressure: 0,
	cTemp: 0,
	fTemp: 0,
	time: ""
}

var measurements = [];
var NumMeasurementsSaved = 20; //The number of measurements to save to calculate the average
var ground = 0;

function getAvgMeasurements()
{
	var avg = { 'altitude' : 0, 'pressure' : 0, 'cTemp' : 0, 'fTemp' : 0 };
	i = measurements.length-1;
	for (var i = 0; i < measurements.length; i++)
	{
		avg.altitude += measurements[i].altitude;
		avg.pressure += measurements[i].pressure;
		avg.cTemp += measurements[i].cTemp;
		avg.fTemp += measurements[i].fTemp;
	}
	avg.altitude /= measurements.length;
	avg.pressure /= measurements.length;
	avg.cTemp /= measurements.length;
	avg.fTemp /= measurements.length;

	return avg;
}

function updateData()
{
	live = document.getElementsByClassName("liveMeas");
	capture = document.getElementsByClassName("capture");
	measureData['altitude'] = parseFloat(live[0].innerHTML)
	measureData['ground'] = parseFloat(capture[0].innerHTML)
	measureData['pressure'] = parseFloat(live[1].innerHTML)
	measureData['cTemp'] = parseFloat(live[2].innerHTML)
	measureData['fTemp'] = parseFloat(live[3].innerHTML)
	measureData['height'] = measureData['altitude']-measureData['ground']
}

// https://stackoverflow.com/questions/41709792/bootstrap-modal-with-wtf
$('#uploadForm').submit(function(event) {
	event.preventDefault();
	updateData();
	measureData['time'] = new Date().toISOString();
	var formData = new FormData();
	formData.append('fileName', $('#file').val());
	formData.append('data', JSON.stringify(measureData));
	formData.append('fileLocation', $('#fileLocationInput').val());
	console.log(formData);
	console.log(JSON.stringify(measureData));

	$.ajax({
		type: "POST",
		url: '/upload',
		data: formData,
		dataType: "json",
		processData: false,
		contentType: false,
		cache: false,
		success: function(data){
			console.log(data);
			if (data.result == 'Success'){
				$('#successToastMsg').html(": File has been succesfully saved ("+ data.result +")");
				$('#successToast').toast('show');
			}
			else if (data.result == 'No file part'){
				$('#warningToastMsg').html(": Failed to upload ("+ data.result +")");
				$('#warningToast').toast('show');
			}
			else if (data.result == 'No file name'){
				$('#warningToastMsg').html(": Failed to upload ("+ data.result +")");
				$('#warningToast').toast('show');
			}
			else if (data.result == 'File path error'){
				$('#warningToastMsg').html(": Failed to upload ("+ data.result +")");
				$('#warningToast').toast('show');
			}
			else {
				$('#dangerToastMsg').html(": Failed to upload (Server error)");
				$('#dangerToast').toast('show');
			}
		},
		error: function(res){
			$('#dangerToastMsg').html(": Failed to upload (Server error)");
			$('#dangerToast').toast('show');
		}
	})
})


function loadData(event){
	event.preventDefault();
	$.ajax({
		type: "GET",
		url: "/readfile",
		processData: false,
		contentType: 'application/json;charset=UTF-8',
		success: function(data){
			console.log(data);
			if (data.result == "Error") {
				$('#dangerToastMsg').html(": No data to read");
				$('#dangerToast').toast('show');
			}
			else {
				console.log(data.data);
				res = JSON.parse(data.data);
				res.forEach(d => {
					try {
						date = new Date(d.time);
						$('#readtable').append('<tr><td><b>' + d.id + '</b></td><td> '+ d.height+ '</td><td> ' + d.altitude + '</td><td>' + d.ground + '</td><td>' + d.cTemp + '</td><td>' + d.fTemp + '</td><td>' + date + '</td></tr>');
					}
					catch {}
				});
			}	
		},
		error: function(res){
			$('#dangerToastMsg').html(": Failed to read");
			$('#dangerToast').toast('show');
		}
	})
}

$('#readDataBtn').one("click", function(event){ loadData(event) });
$('#moreDetailBtn').click(function(event){ 
	$('#readData').empty()
	loadData(event) 
});

$('#videoButton').click(function(event) {
	event.preventDefault();

	button = document.getElementById("videoButton");
	if (button.innerHTML === "Enable Video Feed")
	{
		button.innerHTML = "Disable Video Feed";
	}
	else
	{
		button.innerHTML = "Enable Video Feed";
	}

	//set the text of the button to the opposite
	console.log("called the video button callback");

	$.ajax({
		type: "POST",
		url: '/toggle_camera',
		processData: false,
		contentType: false,
		cache: false
	})
})

$('#captureMeasurementBtn').click(function(event){
	live = document.getElementsByClassName("liveMeas");
	capture = document.getElementsByClassName("capture");
	capture[0].innerHTML = live[0].innerHTML;
	capture[1].innerHTML = live[1].innerHTML;
	capture[2].innerHTML = live[2].innerHTML;
	capture[3].innerHTML = live[3].innerHTML;
})

function pollMeasurements()
{
	$.ajax({
		type: "POST",
		url: 'take_measurement',
		processData: false,
		contentType: false,
		cache: false,
		success: function(data){

			//first store the data into the measurements array. Remove an element if it overflows (6 elements)
			measurements.push(data);
			if (measurements.length > NumMeasurementsSaved)
			{
				measurements.shift()
			}

			//now take the average of the measurements 
			var avg = getAvgMeasurements();

			//console.log("This meas: " + data);
			//console.log("Avg meas: " +avg);
			//$('#successToastMsg').html(": Measurement Taken");
			//$('#successToast').toast('show');
			values = document.getElementsByClassName("liveMeas");
			values[0].innerHTML = (avg.altitude - ground).toPrecision(5); //offset the altitude by the ground
			values[1].innerHTML = avg.pressure.toPrecision(5);
			values[2].innerHTML = avg.cTemp.toPrecision(5);
			values[3].innerHTML = data.fTemp.toPrecision(5);

			//wait half a second and then make another call to the same function
			setTimeout(function() {pollMeasurements();}, 1000);
		},
		error: function(data){
			$('#dangerToastMsg').html(": Failed to take measurement");
			$('#dangerToast').toast('show');
		}
	})
}

pollMeasurements();

$('#setGroundBtn').click(function(event) {
	var avg = getAvgMeasurements();
	currentAlt = avg.altitude;
	ground = currentAlt;
})   


var dps = []; // dataPoints
var chart = new CanvasJS.Chart("chartContainer", {
	title :{
		text: "Altitude Chart"
	},
	axisX: {
		title: "Time",
		includeZero: false
	},
	axisY: {
		title: "Altitude",
		includeZero: false
	},      
	data: [{
		type: "line",
		dataPoints: dps
	}]
});

var xVal = 0;
var yVal = 100; 
var updateInterval = 1000;
var dataLength = 20; // number of dataPoints visible at any point

var updateChart = function (count) {

	count = count || 1;

	for (var j = 0; j < count; j++) {
		updateData()
		yVal = measureData['altitude'];
		dps.push({
			x: xVal,
			y: yVal
		});
		xVal++;
	}

	if (dps.length > dataLength) {
		dps.shift();
	}

	chart.render();
};

updateChart(dataLength);
setInterval(function(){updateChart()}, updateInterval);
