
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

function robertsDetection(matrix, image_data)
{
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	console.log('roberts detection...');
		
	for (var y = 1; y < pixel_matrix.length - 1; y ++) {
		for (var x = 1; x < pixel_matrix[y].length - 1; x++) {

				
			temp_pixel_1 = pixel_matrix[y][x];
			temp_pixel_2 = pixel_matrix[y+1][x+1];
			temp_pixel_3 = pixel_matrix[y+1][x];
			temp_pixel_4 = pixel_matrix[y][x+1];
		
			result_r = Math.sqrt(Math.pow((temp_pixel_1.r - temp_pixel_2.r) , 2) + Math.pow((temp_pixel_3.r - temp_pixel_4.r) , 2));
			result_g = Math.sqrt(Math.pow((temp_pixel_1.g - temp_pixel_2.g) , 2) + Math.pow((temp_pixel_3.g - temp_pixel_4.g) , 2));
			result_b = Math.sqrt(Math.pow((temp_pixel_1.b - temp_pixel_2.b) , 2) + Math.pow((temp_pixel_3.b - temp_pixel_4.b) , 2));
			
			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_g));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_b));
		}
	}

	return temp_pixel_matrix;
}

function laplacianDetection(matrix, image_data)
{
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);

	console.log('laplacian edge detection is executed...');
		
	for (var y = 2; y < pixel_matrix.length - 1; y ++) {
		for (var x = 2; x < pixel_matrix[y].length - 1; x++) {

			temp_pixel_1 = pixel_matrix[y][x];
			temp_pixel_2 = pixel_matrix[y-1][x];
			temp_pixel_3 = pixel_matrix[y][x-1];
			temp_pixel_4 = pixel_matrix[y][x+1];
			temp_pixel_5 = pixel_matrix[y+1][x];

			temp_pixel_6 = pixel_matrix[y-1][x-1];
			temp_pixel_7 = pixel_matrix[y-1][x+1];
			temp_pixel_8 = pixel_matrix[y+1][x-1];
			temp_pixel_9 = pixel_matrix[y+1][x+1];
			
			var result_r = (8 * temp_pixel_1.r) - (temp_pixel_2.r + temp_pixel_3.r + temp_pixel_4.r + temp_pixel_5.r + temp_pixel_6.r + temp_pixel_7.r + temp_pixel_8.r + temp_pixel_9.r);
			var result_g = (8 * temp_pixel_1.g) - (temp_pixel_2.g + temp_pixel_3.g + temp_pixel_4.g + temp_pixel_5.g + temp_pixel_6.g + temp_pixel_7.g + temp_pixel_8.g + temp_pixel_9.g);
			var result_b = (8 * temp_pixel_1.b) - (temp_pixel_2.b + temp_pixel_3.b + temp_pixel_4.b + temp_pixel_5.b + temp_pixel_6.b + temp_pixel_7.b + temp_pixel_8.b + temp_pixel_9.b);

			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_g));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_b));	
		}
	}

	return temp_pixel_matrix;
}

function prewittDetection(matrix, image_data)
{
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);

	console.log('prewitt edge detection is executed...');
		
	for (var y = 2; y < pixel_matrix.length - 1; y ++) {
		for (var x = 2; x < pixel_matrix[y].length - 1; x++) {

			tmp_pxl_1 = pixel_matrix[y-1][x-1];
			tmp_pxl_2 = pixel_matrix[y][x-1];
			tmp_pxl_3 = pixel_matrix[y+1][x-1];
			tmp_pxl_4 = pixel_matrix[y-1][x+1];
			tmp_pxl_5 = pixel_matrix[y][x+1];
			tmp_pxl_6 = pixel_matrix[y+1][x+1];

			tmp_pxl_7 = pixel_matrix[y+1][x-1];
			tmp_pxl_8 = pixel_matrix[y+1][x];
			tmp_pxl_9 = pixel_matrix[y+1][x+1];
			tmp_pxl_10 = pixel_matrix[y-1][x-1];
			tmp_pxl_11 = pixel_matrix[y-1][x];
			tmp_pxl_12 = pixel_matrix[y-1][x+1];
			
			var result_r = Math.sqrt( 
									Math.pow( 
											tmp_pxl_1.r + tmp_pxl_2.r + tmp_pxl_3.r - tmp_pxl_4.r - tmp_pxl_5.r - tmp_pxl_6.r
										,2)  
									+  
									Math.pow( 
											tmp_pxl_7.r + tmp_pxl_8.r + tmp_pxl_9.r - tmp_pxl_10.r - tmp_pxl_11.r - tmp_pxl_12.r
										,2)
							);

			var result_g = Math.sqrt( 
									Math.pow( 
											tmp_pxl_1.g + tmp_pxl_2.g + tmp_pxl_3.g - tmp_pxl_4.g - tmp_pxl_5.g - tmp_pxl_6.g
										,2)  
									+  
									Math.pow( 
											tmp_pxl_7.g + tmp_pxl_8.g + tmp_pxl_9.g - tmp_pxl_10.g - tmp_pxl_11.g - tmp_pxl_12.g
										,2)
							);
			
			var result_b = Math.sqrt( 
									Math.pow( 
											tmp_pxl_1.b + tmp_pxl_2.b + tmp_pxl_3.b - tmp_pxl_4.b- tmp_pxl_5.b - tmp_pxl_6.b
										,2)  
									+  
									Math.pow( 
											tmp_pxl_7.b + tmp_pxl_8.b + tmp_pxl_9.b - tmp_pxl_10.b - tmp_pxl_11.b - tmp_pxl_12.b
										,2)
							);
			
			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_g));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_b));
		}
	}

	return temp_pixel_matrix;
}

function sobelDetection(matrix, image_data)
{
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);

	console.log('sobel edge detection is executed...');
		
	for (var y = 2; y < pixel_matrix.length - 1; y ++) {
		for (var x = 2; x < pixel_matrix[y].length - 1; x++) {

			tmp_pxl_1 = pixel_matrix[y-1][x+1];
			tmp_pxl_2 = pixel_matrix[y][x+1];
			tmp_pxl_3 = pixel_matrix[y+1][x+1];
			tmp_pxl_4 = pixel_matrix[y-1][x-1];
			tmp_pxl_5 = pixel_matrix[y][x-1];
			tmp_pxl_6 = pixel_matrix[y+1][x-1];
			
			tmp_pxl_7 = pixel_matrix[y-1][x-1];
			tmp_pxl_8 = pixel_matrix[y-1][x];
			tmp_pxl_9 = pixel_matrix[y-1][x+1];
			tmp_pxl_10 = pixel_matrix[y+1][x-1];
			tmp_pxl_11 = pixel_matrix[y+1][x];
			tmp_pxl_12 = pixel_matrix[y+1][x+1];
			
			var result_r = Math.sqrt( 
									Math.pow( 
											tmp_pxl_1.r + ( 2 * tmp_pxl_2.r ) + tmp_pxl_3.r - tmp_pxl_4.r - ( 2 * tmp_pxl_5.r ) - tmp_pxl_6.r
										,2)  
									+  
									Math.pow( 
											tmp_pxl_7.r + ( 2 * tmp_pxl_8.r )+ tmp_pxl_9.r - tmp_pxl_10.r - ( 2 * tmp_pxl_11.r ) - tmp_pxl_12.r
										,2)
							);

			var result_g = Math.sqrt( 
									Math.pow( 
											tmp_pxl_1.g + ( 2 * tmp_pxl_2.g ) + tmp_pxl_3.g - tmp_pxl_4.g - ( 2 *  tmp_pxl_5.g ) - tmp_pxl_6.g
										,2)  
									+  
									Math.pow( 
											tmp_pxl_7.g + ( 2 * tmp_pxl_8.g ) + tmp_pxl_9.g - tmp_pxl_10.g - ( 2 *  tmp_pxl_11.g ) - tmp_pxl_12.g
										,2)
							);
			
			var result_b = Math.sqrt( 
									Math.pow( 
											tmp_pxl_1.b +  ( 2 * tmp_pxl_2.b ) + tmp_pxl_3.b - tmp_pxl_4.b- ( 2 * tmp_pxl_5.b ) - tmp_pxl_6.b
										,2)  
									+  
									Math.pow( 
											tmp_pxl_7.b +  ( 2 * tmp_pxl_8.b ) + tmp_pxl_9.b - tmp_pxl_10.b - ( 2 *  tmp_pxl_11.b ) - tmp_pxl_12.b
										,2)
							);
			
			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_g));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_b));	
		}
	}

	return temp_pixel_matrix;
}

function freiChenDetection(matrix, image_data)
{
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);

	console.log('sobel edge detection is executed...');
		
	for (var y = 2; y < pixel_matrix.length - 1; y ++) {
		for (var x = 2; x < pixel_matrix[y].length - 1; x++) {

			tmp_pxl_1 = pixel_matrix[y-1][x+1];
			tmp_pxl_2 = pixel_matrix[y][x+1];
			tmp_pxl_3 = pixel_matrix[y+1][x+1];
			tmp_pxl_4 = pixel_matrix[y-1][x-1];
			tmp_pxl_5 = pixel_matrix[y][x-1];
			tmp_pxl_6 = pixel_matrix[y+1][x-1];
			
			tmp_pxl_7 = pixel_matrix[y-1][x-1];
			tmp_pxl_8 = pixel_matrix[y-1][x];
			tmp_pxl_9 = pixel_matrix[y-1][x+1];
			tmp_pxl_10 = pixel_matrix[y+1][x-1];
			tmp_pxl_11 = pixel_matrix[y+1][x];
			tmp_pxl_12 = pixel_matrix[y+1][x+1];
			
			var result_r = Math.sqrt( 
									Math.pow( 
											tmp_pxl_1.r + ( Math.sqrt(2) * tmp_pxl_2.r ) + tmp_pxl_3.r - tmp_pxl_4.r - ( Math.sqrt(2) * tmp_pxl_5.r ) - tmp_pxl_6.r
										,2)  
									+  
									Math.pow( 
											tmp_pxl_7.r + ( Math.sqrt(2) * tmp_pxl_8.r )+ tmp_pxl_9.r - tmp_pxl_10.r - ( Math.sqrt(2) * tmp_pxl_11.r ) - tmp_pxl_12.r
										,2)
							);

			var result_g = Math.sqrt( 
									Math.pow( 
											tmp_pxl_1.g + ( Math.sqrt(2) * tmp_pxl_2.g ) + tmp_pxl_3.g - tmp_pxl_4.g - ( Math.sqrt(2) *  tmp_pxl_5.g ) - tmp_pxl_6.g
										,2)  
									+  
									Math.pow( 
											tmp_pxl_7.g + ( Math.sqrt(2) * tmp_pxl_8.g ) + tmp_pxl_9.g - tmp_pxl_10.g - ( Math.sqrt(2) *  tmp_pxl_11.g ) - tmp_pxl_12.g
										,2)
							);
			
			var result_b = Math.sqrt( 
									Math.pow( 
											tmp_pxl_1.b +  ( Math.sqrt(2) * tmp_pxl_2.b ) + tmp_pxl_3.b - tmp_pxl_4.b- ( Math.sqrt(2) * tmp_pxl_5.b ) - tmp_pxl_6.b
										,2)  
									+  
									Math.pow( 
											tmp_pxl_7.b +  ( Math.sqrt(2) * tmp_pxl_8.b ) + tmp_pxl_9.b - tmp_pxl_10.b - ( Math.sqrt(2) *  tmp_pxl_11.b ) - tmp_pxl_12.b
										,2)
							);
			
			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_g));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_b));	
		}
	}

	return temp_pixel_matrix;
}

function processEdgeDetection (image_data)
{
	var m = makeMatrix(image_data);
	
	console.log('processEdgeDetection is executed...');
	
	var temp_m = [];
	
	if (image_data.mode == 'roberts') {
		temp_m = robertsDetection(m, image_data); 
	}
	else if (image_data.mode == 'prewitt') {
		temp_m = prewittDetection(m, image_data); 
	}
	else if (image_data.mode == 'laplacian') {
		temp_m = laplacianDetection(m, image_data); 
	}
	else if (image_data.mode == 'sobel') {
		temp_m = sobelDetection(m, image_data); 
	}
	else if (image_data.mode == 'freiChen') {
		temp_m = freiChenDetection(m, image_data); 
	}

	var new_image_data = makeUInt8ClampedArray(temp_m, image_data);

	self.postMessage({'new_image_data':new_image_data});
}

self.onmessage = function(e) {
  	console.log('this is a message from worker...');
	processEdgeDetection(e.data);
}