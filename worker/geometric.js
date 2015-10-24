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
	
	delete pixel_item;
	delete idx;
	delete pixel_matrix_row;
	delete pixel_data;
	
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

function zoom(matrix, image_data, scalex, scaley)
{
	console.log('zoom is executed');

	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	
	var sx = scalex;
	var sy = scaley;
	
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

function flip(matrix, image_data, mode)
{
	console.log('flip is executed');

	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	
	var result_r;
	var result_g;
	var result_b;
	var temp_pixel = {};
	var height = pixel_matrix.length;
	var width = pixel_matrix[0].length;

	for (var y = 1; y < height; y ++) {
		for (var x = 1; x < width; x++) {

			if (mode == 'horizontal')
			{
				x2 = width - x + 1;
				if (pixel_matrix[y] == undefined || pixel_matrix[y][x2] == undefined)
				{
					continue;
				}
				else {
					temp_pixel = pixel_matrix[y][x2];
				}
			}
			else 
			{
				y2 = height - y + 1;
				if (pixel_matrix[y2] == undefined || pixel_matrix[y2][x] == undefined)
				{
					continue;
				}
				else {
					temp_pixel = pixel_matrix[y2][x];
				}
			}

			result_r = temp_pixel.r;
			result_g = temp_pixel.g;
			result_b = temp_pixel.b;
			
			temp_pixel_matrix[y][x].r = Math.abs(parseFloat(result_r));
			temp_pixel_matrix[y][x].g = Math.abs(parseFloat(result_g));
			temp_pixel_matrix[y][x].b = Math.abs(parseFloat(result_b));
		
		}
	}

	return temp_pixel_matrix;
}

function full_rotation (matrix, image_data)
{
	/* WORK IN PROGRESS */
}

function interpolate_zoom (matrix, image_data, scalex, scaley)
{
	/* WORK IN PROGRESS */
	console.log('zoom is executed');

	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	
	var sx = scalex;
	var sy = scaley;
	
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
				p = Math.floor(y2);
				q = Math.floor(x2);
				a = y2 - p;
				b = x2 - q;

				if (pixel_matrix[y] == undefined || pixel_matrix[y][x] == undefined)
				{
					continue;
				}
				else 
				{
					if ( (p == pixel_matrix[y].length ) || ( q == pixel_matrix.length ) )
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

function affine (matrix, image_data, a11, a12, a21, a22, tx, ty)
{
	console.log('affine is executed');
	
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	
	var result_r;
	var result_g;
	var result_b;
	

	for (var y = 1; y < pixel_matrix.length; y ++) {
		for (var x = 1; x < pixel_matrix[y].length; x++) {
			new_x = a11 * x + a12 * y + tx;
			new_y = a21 * x + a22 * y + ty;
			
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

function ripple (matrix, image_data, ax, ay, tx, ty)
{
	console.log('ripple is executed');
	
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	
	var result_r;
	var result_g;
	var result_b;
	
	for (var y = 1; y < pixel_matrix.length; y ++) {
		for (var x = 1; x < pixel_matrix[y].length; x++) {
			new_x = x + ax * Math.sin(2 * 3.14 * y / tx);
			new_y = y + ay * Math.sin(2 * 3.14 * x / ty);
			
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

function twirl(matrix, image_data)
{
	console.log('twirl is executed');
	
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	
	var height = pixel_matrix.length;
	var width = pixel_matrix[0].length;
	var xc = Math.round(width / 2);
	var yc = Math.round(height / 2);

	var alpha = 43 * 3.14 / 180;
	rmax = 0.5 * Math.sqrt( Math.pow(xc, 2) + Math.pow(yc, 2));

	var result_r;
	var result_g;
	var result_b;
	
	for (var y = 1; y < height; y ++) {
		for (var x = 1; x < width; x++) {
			r = Math.sqrt(Math.pow((x - xc), 2) + Math.pow((y - yc), 2));
			beta = Math.atan2(y-yc, x-xc) + alpha * (rmax - r) / rmax;
			
			new_x = xc + r * Math.cos(beta);
			new_y = yc + r * Math.sin(beta);
			
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

function bilinear (matrix, image_data, a1, a2, a3, a4, b1, b2, b3, b4)
{
	console.log('bilinear is executed');
	
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	
	var height = pixel_matrix.length;
	var width = pixel_matrix[0].length;

	var result_r;
	var result_g;
	var result_b;
	
	for (var y = 1; y < height; y ++) {
		for (var x = 1; x < width; x++) {
			new_x = a1 * x + a2 * y + a3 * x * y + a4 ;
			new_y = b1 * x + b2 * y + b3 * x * y + b4 ;
			
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
					if (pixel_matrix[p] != undefined ){
						result_r = pixel_matrix[p][q].r;
						result_g = pixel_matrix[p][q].g;
						result_b = pixel_matrix[p][q].b;
					}
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

function spherical(matrix, image_data, rho)
{
	console.log('spherical is executed');
	
	var pixel_matrix = matrix;
	var temp_pixel_matrix = makeZeroMatrix(image_data);
	
	var height = pixel_matrix.length;
	var width = pixel_matrix[0].length;
	var xc = Math.round(width / 2);
	var yc = Math.round(height / 2);
	
	rmax = xc;

	var result_r;
	var result_g;
	var result_b;
	
	for (var y = 1; y < height; y ++) {
		for (var x = 1; x < width; x++) {
			r = Math.sqrt(Math.pow((x - xc), 2) + Math.pow((y - yc), 2));
			z = Math.sqrt(Math.pow(rmax, 2) - Math.pow(r, 2))
			bx = (1 - 1 / rho) * Math.asin((x - xc) / Math.sqrt( Math.pow((x - xc), 2) + Math.pow(z, 2) ));
			by = (1 - 1 / rho) * Math.asin((y - yc) / Math.sqrt( Math.pow((y - yc), 2) + Math.pow(z, 2) ));
			
			if (r <= rmax)
			{
				new_x = x - z * Math.tan(bx);
				new_y = y - z * Math.tan(by);
			}
			else 
			{
				new_x = x;
				new_y = y;
			}
			
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

function processGeometric (image_data)
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
		temp_m = zoom(m, image_data, 1.5, 1.5); 
	}
	else if (image_data.mode == 'zoom-out') {
		temp_m = zoom(m, image_data, 0.5, 0.5); 
	}
	else if (image_data.mode == 'interpolate-zoom') {
		temp_m = interpolate_zoom(m, image_data, 1.5, 1.5); 
	}
	else if (image_data.mode == 'flip') {
		temp_m = flip(m, image_data, 'horizontal'); 
	}
	else if (image_data.mode == 'vertical-flip') {
		temp_m = flip(m, image_data, 'vertical'); 
	}
	else if (image_data.mode == 'affine') {
		rad = 10 * 3.14 / 180;
		temp_m = affine(m, image_data, (2 * Math.cos(rad)), Math.sin(rad), (-1 * Math.sin(rad)), (2 * Math.cos(rad)), -30, -50); 
	}
	else if (image_data.mode == 'ripple') {
		temp_m = ripple(m, image_data, 15, 15, 120,250); 
	}
	else if (image_data.mode == 'twirl') {
		temp_m = twirl(m, image_data); 
	}
	else if (image_data.mode == 'bilinear') {
		temp_m = bilinear(m, image_data, 1.2, 0.1, 0.005, -45, 0.1, 1, 0.005, -30); 
	}
	else if (image_data.mode == 'spherical') {
		temp_m = spherical(m, image_data, 1.8); 
	}

	var new_image_data = makeUInt8ClampedArray(temp_m, image_data);
	self.postMessage({'new_image_data':new_image_data});
}

self.onmessage = function(e) {
  	console.log('this is a message from worker...');
	processGeometric(e.data);
}