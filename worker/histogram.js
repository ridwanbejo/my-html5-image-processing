function makeHistogram(image_data)
{
	console.log('histogram executed...');
	
	var d = data = image_data.imageData
	var histogram = new Array(256);
	
	// proses pembentukan histogram
	for (var idx = 0; idx <  histogram.length; idx ++ )
	{
		histogram[idx] = 0;	
	}

	for (var idx=0; idx < data.length; idx+=4) {
		r = parseInt(data[idx]);
		histogram[r] = histogram[r] + 1;
	}

	return histogram;
}

function equalization(image_data, histogram)
{
	console.log('equalization executed...');
	
	var d = data = image_data.imageData
	var alpha = 255 / (image_data.canvas_width * image_data.canvas_height);
	var temp_histogram = new Array(256);

	// proses pembentukan histogram ekualisasi
	for (var idx = 0; idx <  temp_histogram.length; idx ++ )
	{
		temp_histogram[idx] = 0;	
	}

	// console.log(temp_histogram);

	// bug
	temp_histogram[0] = Math.round(alpha * histogram[0]);

	for (var i = 0; i < temp_histogram.length - 1; i++)
	{
		temp_histogram[i+1] = temp_histogram[i] + Math.round(alpha * histogram[i+1]);
	}

	console.log('processingg histogram...');

	// console.log(temp_histogram);

	// proses penggantian warna
	for (var i=0; i<d.length; i+=4) {

		var r = d[i];
		// var g = d[i+1];
		// var b = d[i+2];

		var v = temp_histogram[r];

		d[i] = d[i+1] = d[i+2] = v;
	}

	return d;
}


function processHistogramOperation (image_data)
{
	
	console.log('processHistogramOperation is executed...');
	histogram = makeHistogram(image_data);

	var new_image_data = [];
	if (image_data.mode == 'equalization') {
		new_image_data = equalization(image_data, histogram); 
	}

	self.postMessage({'new_image_data':new_image_data});
}

self.onmessage = function(e) {
  	console.log('this is a message from worker...');
  	console.log(e.data);
	processHistogramOperation(e.data);
}