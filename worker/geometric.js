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

/* FEATURED FUNCTION */
function translation(matrix, image_data)
{
	sx = 45;
	sy = -35;

	console.log('translation is executed');

	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	
	for (var y = 1; y < pixel_matrix.length; y ++) {
		for (var x = 1; x < pixel_matrix[y].length; x++) {
			new_x = x - sx;
			new_y = y - sy;
			
			result_r = 0;
			result_g = 0;
			result_b = 0;

			if (((new_x >= 1) && (new_x <= pixel_matrix[y].length)) && ((new_y >= 1) && (new_y <= pixel_matrix.length)))
			{
				if (pixel_matrix[new_y] == undefined || pixel_matrix[new_x] == undefined)
				{
					continue;
				}
				else
				{
					result_r = pixel_matrix[new_y][new_x].r;
					result_g = pixel_matrix[new_y][new_x].g;
					result_b = pixel_matrix[new_y][new_x].b;
				}
			}
					
			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_g));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_b));
		}
	}

	return temp_pixel_matrix;
}

function rotation(matrix, image_data)
{
	var angle = 10;
	var radians = 3.14 * angle / 180;
	cos_a = Math.cos(radians);
	sin_a = Math.sin(radians);

	console.log('rotation is executed');

	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	
	var result_r;
	var result_g;
	var result_b;
	

	for (var y = 1; y < pixel_matrix.length; y ++) {
		for (var x = 1; x < pixel_matrix[y].length; x++) {
			new_x = Math.round( x * cos_a + y * sin_a);
			new_y = Math.round( y * cos_a - x * sin_a);
			
			result_r = 0;
			result_g = 0;
			result_b = 0;

			if (((new_x >= 1) && (new_x <= pixel_matrix[y].length)) && ((new_y >= 1) && (new_y <= pixel_matrix.length)))
			{
				if (pixel_matrix[new_y] == undefined || pixel_matrix[new_x] == undefined)
				{
					continue;
				}
				else
				{
					result_r = pixel_matrix[new_y][new_x].r;
					result_g = pixel_matrix[new_y][new_x].g;
					result_b = pixel_matrix[new_y][new_x].b;
				}
			}
					
			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_g));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_b));
		}
	}

	return temp_pixel_matrix;
}

function interpolation(matrix, image_data)
{
	var angle = 15;
	var radians = 3.14 * angle / 180;
	cos_a = Math.cos(radians);
	sin_a = Math.sin(radians);

	console.log('interpolation is executed');

	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	
	var result_r;
	var result_g;
	var result_b;
	

	for (var y = 1; y < pixel_matrix.length; y ++) {
		for (var x = 1; x < pixel_matrix[y].length; x++) {
			new_x = x * cos_a + y * sin_a;
			new_y = y * cos_a - x * sin_a;
			
			result_r = 0;
			result_g = 0;
			result_b = 0;

			if (((new_x >= 1) && (new_x <= pixel_matrix[y].length)) && ((new_y >= 1) && (new_y <= pixel_matrix.length)))
			{
				p = Math.floor(new_y);
				q = Math.floor(new_x);
				a = new_y - p;
				b = new_x - q;

				if ( (new_x == pixel_matrix[y].length ) || ( new_y == pixel_matrix.length ) )
				{
					result_r = pixel_matrix[p][q].r;
					result_g = pixel_matrix[p][q].g;
					result_b = pixel_matrix[p][q].b;
				}
				else
				{
					if (pixel_matrix[p][q+1] == undefined || pixel_matrix[p+1][q+1] == undefined || pixel_matrix[p+1][q] == undefined)
					{
						continue;
					}
					else
					{
						intensity_r = (1 - a) * ((1-b)*pixel_matrix[p][q].r + b * pixel_matrix[p][q+1].r) + a * ((1-b)* pixel_matrix[p+1][q].r + b * pixel_matrix[p+1][q+1].r);
						intensity_g = (1 - a) * ((1-b)*pixel_matrix[p][q].g + b * pixel_matrix[p][q+1].g) + a * ((1-b)* pixel_matrix[p+1][q].g + b * pixel_matrix[p+1][q+1].g);
						intensity_b = (1 - a) * ((1-b)*pixel_matrix[p][q].b + b * pixel_matrix[p][q+1].b) + a * ((1-b)* pixel_matrix[p+1][q].b + b * pixel_matrix[p+1][q+1].b);
						
						result_r = intensity_r;
						result_g = intensity_g;
						result_b = intensity_b;	
					}
					
				}
			}
					
			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_g));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_b));
		}
	}

	return temp_pixel_matrix;
}

function specifiedRotation(matrix, image_data)
{
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);

	console.log('specifiedRotation is executed');

	var angle = 45;
	var radians = 3.14 * angle / 180;
	var m = Math.floor(pixel_matrix.length / 2);
	var n = Math.floor(pixel_matrix[0].length / 2);
	cos_a = Math.cos(radians);
	sin_a = Math.sin(radians);

	var result_r;
	var result_g;
	var result_b;
	
	console.log(m);
	console.log(n);

	for (var y = 1; y < pixel_matrix.length; y ++) {
		for (var x = 1; x < pixel_matrix[y].length; x++) {
			new_x = (x - n) * cos_a + (y - m) * sin_a + n;
			new_y = (y - m) * cos_a - (x - n) * sin_a + m;
			
			result_r = 0;
			result_g = 0;
			result_b = 0;

			if (((new_x >= 1) && (new_x <= pixel_matrix[y].length)) && ((new_y >= 1) && (new_y <= pixel_matrix.length)))
			{
				p = Math.floor(new_y);
				q = Math.floor(new_x);
				a = new_y - p;
				b = new_x - q;

				if ( (new_x == pixel_matrix[y].length ) || ( new_y == pixel_matrix.length ) )
				{
					result_r = pixel_matrix[p][q].r;
					result_g = pixel_matrix[p][q].g;
					result_b = pixel_matrix[p][q].b;
				}
				else
				{
					if (pixel_matrix[p+1] == undefined || pixel_matrix[p][q+1] == undefined || pixel_matrix[p+1][q+1] == undefined || pixel_matrix[p+1][q] == undefined)
					{
						continue;
					}
					else
					{
						intensity_r = (1 - a) * ((1-b)*pixel_matrix[p][q].r + b * pixel_matrix[p][q+1].r) + a * ((1-b)* pixel_matrix[p+1][q].r + b * pixel_matrix[p+1][q+1].r);
						intensity_g = (1 - a) * ((1-b)*pixel_matrix[p][q].g + b * pixel_matrix[p][q+1].g) + a * ((1-b)* pixel_matrix[p+1][q].g + b * pixel_matrix[p+1][q+1].g);
						intensity_b = (1 - a) * ((1-b)*pixel_matrix[p][q].b + b * pixel_matrix[p][q+1].b) + a * ((1-b)* pixel_matrix[p+1][q].b + b * pixel_matrix[p+1][q+1].b);
						
						result_r = intensity_r;
						result_g = intensity_g;
						result_b = intensity_b;	
					}
					
				}
			}
					
			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_g));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_b));
		}
	}

	return temp_pixel_matrix;
}

function zoomIn(matrix, image_data)
{
	console.log('specifiedRotation is executed');

	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	
	var sx = 1.5;
	var sy = 1.5;
	
	new_width = pixel_matrix[0].length * sx;
	new_height = pixel_matrix.length * sy;

	var result_r;
	var result_g;
	var result_b;
	var temp_pixel;

	for (var y = 1; y < new_height; y ++) {
		y2 = ((y - 1) / sy) + 1;
		for (var x = 1; x < new_width; x++) {
			x2 = ((x - 1) / sx) + 1

			if (pixel_matrix[Math.floor(y2)] == undefined || pixel_matrix[Math.floor(y2)][Math.floor(x2)] == undefined)
			{
				continue;
			}
			else
			{
				temp_pixel = pixel_matrix[Math.floor(y2)][Math.floor(x2)];

				result_r = temp_pixel.r;
				result_g = temp_pixel.g;
				result_b = temp_pixel.b;
				
				if (temp_pixel_matrix[y] == undefined || temp_pixel_matrix[y][x] == undefined)
				{
					continue;
				}
				else
				{
					temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
					temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_g));
					temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_b));
				}
			}
		}
	}

	return temp_pixel_matrix;
}

function processPixelAdjacency (image_data)
{
	var m = makeMatrix(image_data);
	
	console.log('geometric is executed...');
	
	var temp_m = [];
	
	if (image_data.mode == 'translation') {
		temp_m = translation(m, image_data); 
	}
	else if (image_data.mode == 'rotation') {
		temp_m = rotation(m, image_data); 
	}
	else if (image_data.mode == 'interpolation') {
		temp_m = interpolation(m, image_data); 
	}
	else if (image_data.mode == 'specified-rotation') {
		temp_m = specifiedRotation(m, image_data); 
	}
	else if (image_data.mode == 'zoom-in') {
		temp_m = zoomIn(m, image_data); 
	}

	var new_image_data = makeUInt8ClampedArray(temp_m, image_data);
	self.postMessage({'new_image_data':new_image_data});
}
	
self.onmessage = function(e) {
  	console.log('this is a message from worker...');
	processPixelAdjacency(e.data);
}