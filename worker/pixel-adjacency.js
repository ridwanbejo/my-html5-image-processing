
function makeZeroMatrix (image_data)
{
	var pixel_matrix = [];
	var pixel_matrix_row = [];	
	var pixel_item = {};
	var idx = 0;

	pixel_data = image_data.imageData;

	for (var y = 0; y < image_data.canvas_height; y ++) {
		
		for (var x = 0; x < image_data.canvas_width; x++) {
			pixel_item.r =  0;
			pixel_item.g =  0;
			pixel_item.b =  0;
			pixel_item.a =  255;	

			pixel_matrix_row.push(pixel_item);
			pixel_item = {};		
		}

		pixel_matrix.push(pixel_matrix_row);
		pixel_matrix_row = [];
	}

	return pixel_matrix;
}

function makeMatrix (image_data)
{
	var pixel_matrix = [];
	var pixel_matrix_row = [];	
	var pixel_item = {};
	var idx = 0;

	pixel_data = image_data.imageData;

	for (var y = 0; y < image_data.canvas_height; y ++) {
		
		for (var x = 0; x < image_data.canvas_width; x++) {
			pixel_item.r =  pixel_data[idx];
			pixel_item.g =  pixel_data[idx + 1];
			pixel_item.b =  pixel_data[idx + 2];
			pixel_item.a =  pixel_data[idx + 3];	

			pixel_matrix_row.push(pixel_item);
			pixel_item = {};		
			
			idx += 4;
		}

		pixel_matrix.push(pixel_matrix_row);
		pixel_matrix_row = [];
	}

	return pixel_matrix;
}

function makeUInt8ClampedArray(matrix, image_data)
{
	var idx = 4;

	temp_image_data = [];

	for (var y = 0; y < image_data.canvas_height; y ++) {
		
		for (var x = 0; x < image_data.canvas_width; x++) {
			pixel_data = matrix[y][x];

			temp_image_data[idx - 4] = pixel_data.r;
			temp_image_data[idx - 3] = pixel_data.g;
			temp_image_data[idx - 2] = pixel_data.b;
			temp_image_data[idx - 1] = pixel_data.a;
			
			idx += 4;
		}
	}

	return Uint8ClampedArray(temp_image_data);
}

function edgeFilter(matrix, image_data)
{
	/* MASUKAN HARUS GRAYSCALE */
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	console.log('edgeFilters...');
		
	for (var y = 2; y < pixel_matrix.length - 1; y ++) {
		for (var x = 2; x < pixel_matrix[y].length - 1; x++) {

			temp_pixel_1 = pixel_matrix[y-1][x-1];
			temp_pixel_2 = pixel_matrix[y-1][x];
			temp_pixel_3 = pixel_matrix[y-1][x+1];
			temp_pixel_4 = pixel_matrix[y][x-1];
			temp_pixel_5 = pixel_matrix[y][x+1];
			temp_pixel_6 = pixel_matrix[y+1][x-1];
			temp_pixel_7 = pixel_matrix[y+1][x];
			temp_pixel_8 = pixel_matrix[y+1][x+1];
			
			result_r = Math.sqrt(Math.pow((temp_pixel_1.r - temp_pixel_2.r) , 2) + Math.pow((temp_pixel_3.r - temp_pixel_4.r) , 2));
			// result_g = Math.sqrt(Math.pow((temp_pixel_1.g - temp_pixel_2.g) , 2) + Math.pow((temp_pixel_3.g - temp_pixel_4.g) , 2));
			// result_b = Math.sqrt(Math.pow((temp_pixel_1.b - temp_pixel_2.b) , 2) + Math.pow((temp_pixel_3.b - temp_pixel_4.b) , 2));
			
			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_r));
		}
	}

	return temp_pixel_matrix;
}

function processPixelAdjacency (image_data)
{
	var m = makeMatrix(image_data);
	
	console.log('processPixelAdjacency is executed...');
	
	var temp_m = [];
	
	if (image_data.mode == 'edge-filter') {
		temp_m = edgeFilter(m, image_data); 
	}

	var new_image_data = makeUInt8ClampedArray(temp_m, image_data);

	self.postMessage({'new_image_data':new_image_data});
}
	
self.onmessage = function(e) {
  	console.log('this is a message from worker...');
	processPixelAdjacency(e.data);
}