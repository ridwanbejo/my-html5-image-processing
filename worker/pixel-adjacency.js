/* LOCAL JS HELPER */
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

function rebuildMatrix(matrix, new_value, operator)
{
	var temp_matrix = matrix;

	for (var y = 0; y < temp_matrix.length; y++) {
		for (var x = 0; x < temp_matrix[0].length; x++) {
			if (operator == 'plus')
			{
				temp_matrix[y][x] = matrix[y][x] + new_value;
			}
			else if (operator == 'substract') 
			{
				temp_matrix[y][x] = matrix[y][x] - new_value;
			}
			else if (operator == 'divide')
			{
				temp_matrix[y][x] = matrix[y][x] / new_value;
			}
			else if (operator == 'times')
			{
				temp_matrix[y][x] = matrix[y][x] * new_value;
			}
		}
	}

	return temp_matrix;
}

/* FEATURED FUNCTION */
function edgeFilter(matrix, image_data)
{
	/* MASUKAN HARUS GRAYSCALE */
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	console.log('edgeFilters...');
		
	for (var y = 1; y < pixel_matrix.length - 1; y ++) {
		for (var x = 1; x < pixel_matrix[y].length - 1; x++) {

			curr_pixel = pixel_matrix[y][x];
			temp_pixel_1 = pixel_matrix[y-1][x-1];
			temp_pixel_2 = pixel_matrix[y-1][x];
			temp_pixel_3 = pixel_matrix[y-1][x+1];
			temp_pixel_4 = pixel_matrix[y][x-1];
			temp_pixel_5 = pixel_matrix[y][x+1];
			temp_pixel_6 = pixel_matrix[y+1][x-1];
			temp_pixel_7 = pixel_matrix[y+1][x];
			temp_pixel_8 = pixel_matrix[y+1][x+1];
			
			edge_filter_arr = [temp_pixel_1.r, temp_pixel_2.r, temp_pixel_3.r, temp_pixel_4.r, temp_pixel_5.r, temp_pixel_6.r, temp_pixel_7.r, temp_pixel_8.r];
			// console.log(edge_filter_arr);

			max_pixel_val = Math.max(...edge_filter_arr);
			min_pixel_val = Math.min(...edge_filter_arr);

			// proses edge filter
			result_r = 0;
			
			// result_g = curr_pixel.g;
			// result_b = curr_pixel.b;
			// res = [curr_pixel.r, result_r, min_pixel_val, max_pixel_val];

			if (curr_pixel.r < min_pixel_val)
			{
				result_r = min_pixel_val;
				// result_g = min_pixel_val;
				// result_b = min_pixel_val;
			}
			else 
			{
				if (curr_pixel.r > max_pixel_val)
				{
					result_r = max_pixel_val;
					// result_g = min_pixel_val;
					// result_b = min_pixel_val;
				}
				else
				{
					result_r = curr_pixel.r;
				}
			}

			// res.push(result_r);
			// console.log(res);

			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_r));
		}
	}

	return temp_pixel_matrix;
}

function averageFilter(matrix, image_data)
{
	/* MASUKAN HARUS GRAYSCALE */
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	console.log('averageFilters...');
		
	for (var y = 1; y < pixel_matrix.length - 1; y ++) {
		for (var x = 1; x < pixel_matrix[y].length - 1; x++) {

			curr_pixel = pixel_matrix[y][x];
			temp_pixel_1 = pixel_matrix[y-1][x-1];
			temp_pixel_2 = pixel_matrix[y-1][x];
			temp_pixel_3 = pixel_matrix[y-1][x+1];
			temp_pixel_4 = pixel_matrix[y][x-1];
			temp_pixel_5 = pixel_matrix[y][x+1];
			temp_pixel_6 = pixel_matrix[y+1][x-1];
			temp_pixel_7 = pixel_matrix[y+1][x];
			temp_pixel_8 = pixel_matrix[y+1][x+1];
			
			sum_pixel = temp_pixel_1.r + temp_pixel_2.r + temp_pixel_3.r + temp_pixel_4.r + temp_pixel_5.r + temp_pixel_6.r + temp_pixel_7.r + temp_pixel_8.r;
			// console.log(edge_filter_arr);

			// proses average filter
			result_r = sum_pixel / 9;
			
			// result_g = curr_pixel.g;
			// result_b = curr_pixel.b;

			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_r));
		}
	}

	return temp_pixel_matrix;
}

function medianFilter(matrix, image_data)
{
	/* MASUKAN HARUS GRAYSCALE */
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	console.log('averageFilters...');
		
	for (var y = 1; y < pixel_matrix.length - 1; y ++) {
		for (var x = 1; x < pixel_matrix[y].length - 1; x++) {

			// proses median filter
			temp_pixel = new Uint8Array(9);

			temp_pixel[0] = Math.abs(pixel_matrix[y][x].r);
			temp_pixel[1] = Math.abs(pixel_matrix[y-1][x-1].r);
			temp_pixel[2] = Math.abs(pixel_matrix[y-1][x].r);
			temp_pixel[3] = Math.abs(pixel_matrix[y-1][x+1].r);
			temp_pixel[4] = Math.abs(pixel_matrix[y][x-1].r);
			temp_pixel[5] = Math.abs(pixel_matrix[y][x+1].r);
			temp_pixel[6] = Math.abs(pixel_matrix[y+1][x-1].r);
			temp_pixel[7] = Math.abs(pixel_matrix[y+1][x].r);
			temp_pixel[8] = Math.abs(pixel_matrix[y+1][x+1].r);
			
			sorted_pixel = Array.sort(temp_pixel);
			// console.log(sorted_pixel);

			result_r = sorted_pixel[5];
			// result_g = curr_pixel.g;
			// result_b = curr_pixel.b;
			
			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_r));
		}
	}

	return temp_pixel_matrix;
}

function convolution(matrix, image_data, filter)
{
	/* MASUKAN HARUS GRAYSCALE */
	console.log('convolution...');
	
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	
	filter_height = filter.length;
	filter_width = filter[0].length;

	m2 = Math.floor(filter_height / 2);
	n2 = Math.floor(filter_width / 2);
	
	for (var y = m2 + 1; y < pixel_matrix.length -  m2; y ++) {
		for (var x = n2 + 1; x < pixel_matrix[y].length - n2; x++) {

			// proses convolution filter
			result = 0;
			for (var p = -m2; p <= m2; p++)
			{
				for (var q = -n2; q <= n2; q++)
				{
					temp_result = filter[p+m2][q+n2] * pixel_matrix[y-p][x-q].r;
					result = result + temp_result;
				}
			}

			result_r = result;
			// result_g = curr_pixel.g;
			// result_b = curr_pixel.b;
			
			temp_pixel_matrix[y-m2][x-n2].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y-m2][x-n2].g = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y-m2][x-n2].b = Math.abs(parseFloat(result_r));
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
	else if (image_data.mode == 'average-filter') {
		temp_m = averageFilter(m, image_data); 
	}
	else if (image_data.mode == 'median-filter') {
		temp_m = medianFilter(m, image_data); 
	}
	else if (image_data.mode == 'quick-mask') {
		filter = [[-1, 0, -1], [0, 4, 0], [-1, 0, -1]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'low-pass-filter-1') {
		filter = [[0, 1, 0], [1, 2, 1], [0, 1, 0]];
		new_filter = rebuildMatrix(filter, 6, 'divide');
		temp_m = convolution(m, image_data, new_filter); 
	}
	else if (image_data.mode == 'low-pass-filter-2') {
		filter = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];
		new_filter = rebuildMatrix(filter, 9, 'divide');
		temp_m = convolution(m, image_data, new_filter); 
	}
	else if (image_data.mode == 'low-pass-filter-3') {
		filter = [[1, 1, 1], [1, 2, 1], [1, 1, 1]];
		new_filter = rebuildMatrix(filter, 10, 'divide');
		temp_m = convolution(m, image_data, new_filter); 
	}
	else if (image_data.mode == 'low-pass-filter-4') {
		filter = [[1, 2, 1], [2, 4, 2], [1, 2, 1]];
		new_filter = rebuildMatrix(filter, 16, 'divide');
		temp_m = convolution(m, image_data,new_filter); 
	}
	else if (image_data.mode == 'sharpen') {
		filter = [[0, -1, 0], [-1, 5, -1], [0, -1, 0]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'sharpen-10') {
		filter = [[-1, -1, -1], [-1, 10, -1], [-1, -1, -1]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'high-pass-filter-1') {
		filter = [[0, -1, 0], [-1, 4, -1], [0, -1, 0]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'high-pass-filter-2') {
		filter = [[-1, -1, -1], [-1, 8, -1], [-1, -1, -1]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'high-pass-filter-3') {
		filter = [[1, -2, 1], [-2, 4, -2], [1, -2, 1]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'emboss-1') {
		filter = [[-2, 0, 0], [0, 0, 0], [0, 0, 2]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'emboss-2') {
		filter = [[-1, 0, 0], [0, 0, 0], [0, 0, 1]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'emboss-3') {
		filter = [[1, 0, 0], [0, 0, 0], [0, 0, -1]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'emboss-4') {
		filter = [[0, 0, 0], [-4, 0, 4], [0, 0, 0]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'emboss-5') {
		filter = [[-4, -4, 0], [-4, 1, 4], [0, 4, 4]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'emboss-6') {
		filter = [[-6, 0, 6], [-6, 1, 6], [-6, 0, 6]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'emboss-7') {
		filter = [[4, 4, 0], [4, 1, -4], [0, -4, -4]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'emboss-8') {
		filter = [[6, 0, -6], [6, 1, -6], [6, 0, -6]];
		temp_m = convolution(m, image_data, filter); 
	}
	else if (image_data.mode == 'gaussian') {
		filter = [[1,5,7,5,1], [5,20,33,20,5], [7,33,55,33,7], [5,20,33,20,5], [1,5,7,5,1]];
		new_filter = rebuildMatrix(filter, 339, 'divide');
		temp_m = convolution(m, image_data, new_filter); 
	}

	var new_image_data = makeUInt8ClampedArray(temp_m, image_data);
	self.postMessage({'new_image_data':new_image_data});
}
	
self.onmessage = function(e) {
  	console.log('this is a message from worker...');
	processPixelAdjacency(e.data);
}