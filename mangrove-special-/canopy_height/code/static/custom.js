// Custom javascript

var data = {
	'altitude': 0,
	'pressure': 0,
	'cTemp': 0,
	'fTemp': 0,
	'time': ""
}

var measurements = [];
var NumMeasurementsSaved = 20; //The number of measurements to save to calculate the average
var ground = 0;

function getAvgMeasurements()
{
	var avg = { 'altitude' : 0, 'pressure' : 0, 'cTemp' : 0, 'fTemp' : 0 };
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

// https://stackoverflow.com/questions/41709792/bootstrap-modal-with-wtf
$('#uploadForm').submit(function(event) {
	event.preventDefault();
	data['time'] = new Date().toISOString();
	var formData = new FormData();
	formData.append('file', $('#file')[0].files[0]);
	formData.append('data', JSON.stringify(data));
	console.log(formData);

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
				$('#successToastMsg').html(": File has been succesfully saved");
				$('#successToast').toast('show');
			}
			else if (data.result == 'No file part'){
				$('#warningToastMsg').html(": Failed to upload (No file input)");
				$('#warningToast').toast('show');
			}
			else if (data.result == 'No file selected'){
				$('#warningToastMsg').html(": Failed to upload (No file input)");
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
			setTimeout(function() {pollMeasurements();}, 500);
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
