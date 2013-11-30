// this camera code is from notes i made ages ago, it is from *somewhere* -- i cannot remember where
// that somewhere is
function Camera(origin, lookat, up) {
	var zaxis = normaliseVector(subVector(lookat, origin));
	var xaxis = normaliseVector(cross(up, zaxis));
	var yaxis = normaliseVector(cross(xaxis, subVector([0,0,0], zaxis)));
	var m = [];
	m[0] = xaxis[0]; m[1] = xaxis[1]; m[2] = xaxis[2];
	m[4] = yaxis[0]; m[5] = yaxis[1]; m[6] = yaxis[2];
	m[8] = zaxis[0]; m[9] = zaxis[1]; m[10] = zaxis[2];
    invertMatrix(m);
	m[3] = 0; m[7] = 0; m[11] = 0;
	this.origin = origin;
	var directions = this.directions = [0,0,0,0];
	directions[0] = normalise([-0.7,  0.7, 1]);
	directions[1] = normalise([ 0.7,  0.7, 1]);
	directions[2] = normalise([ 0.7, -0.7, 1]);
	directions[3] = normalise([-0.7, -0.7, 1]);
	directions[0] = transformMatrix(m, directions[0]);
	directions[1] = transformMatrix(m, directions[1]);
	directions[2] = transformMatrix(m, directions[2]);
	directions[3] = transformMatrix(m, directions[3]);
}

Camera.prototype.generateRayPair = function(y) {
	rays = [new Object(), new Object()];
	rays[0].origin = rays[1].origin = this.origin;
	var directions = this.directions;
	rays[0].dir = addVector(scale(directions[0], y), scale(directions[3], 1 - y));
	rays[1].dir = addVector(scale(directions[1], y), scale(directions[2], 1 - y));
	return rays;
}

var imageDataCache = false;
var numLines = 2;
function renderRows(camera, scene, canvas, width, height, starty, stopy, toCompletion) {
    var vadd = addVector;
    var vscale = scale;
    var vnormalise = normaliseVector;
    var round = Math.round;
    if (canvas.putImageData) {
        var blockHeight = stopy - starty;
        var imageData = imageDataCache ? imageDataCache : (imageDataCache = canvas.createImageData(width, height));
        var data = imageData.data;
        var index = (height - stopy) * width * 4;
		for (var y = stopy - 1; y >= starty; y--) {
			var rays = camera.generateRayPair(y / height);
			for (var x = 0; x < width; x++) {
				var xp = x / width;
				var origin = vadd(vscale(rays[0].origin, xp), vscale(rays[1].origin, 1 - xp));
				var dir = vnormalise(vadd(vscale(rays[0].dir, xp), vscale(rays[1].dir, 1 - xp)));
				var l = scene.intersect(origin, dir, 0.00001, 100000);
				data[index]=round(l[0]*255);
				data[index+1]=round(l[1]*255);
				data[index+2]=round(l[2]*255);
				data[index+3]=255;
				index += 4;
			}
		}
		canvas.putImageData(imageData, 0, 0);//, 0, height - stopy, width, blockHeight);
    } else {
		for (var y = starty; y < stopy; y++) {
			var rays = camera.generateRayPair(y / height);
			for (var x = 0; x < width; x++) {
				var xp = x / width;
				var origin = vadd(vscale(rays[0].origin, xp), vscale(rays[1].origin, 1 - xp));
				var dir = vnormalise(vadd(vscale(rays[0].dir, xp), vscale(rays[1].dir, 1 - xp)));
				var l = scene.intersect(origin, dir, 0.00001, 100000);
				canvas.setFillColor(l[0], l[1], l[2], 1);
				canvas.fillRect(x, y, 1, 1);
			}
		}
	}
    if (stopy < height) {
        if (toCompletion)
            setTimeout(function(){renderRows(camera, scene, canvas, width, height, stopy, stopy + numLines, true)}, 10);
        else
            imageDataCache = null; // clear the imageData cache as the trial run may be a different
                                   // size from the image data needed in the actual rendering
    } else if (camera.onFinished) {
        camera.onFinished();
    }
}

var floor = Math.floor;

Camera.prototype.render = function(scene, canvas, width, height) {
    canvas.fillStyle = 'red';
    canvas.fillRect(0, 0, width, height);  
    canvas.scale(1, -1);
    canvas.translate(0, -height); 
    if (!canvas.setFillColor) 
        canvas.setFillColor = function(r,g,b,a, canvas) {
            this.fillStyle = "rgb("+[floor(r * 255), floor(g * 255), floor(b * 255)]+")";
        }
	if (!canvas.createImageData)
		canvas.createImageData = function (w,h) { return this.getImageData(0,0,w,h); }

    var cam = this;
    var start = new Date();
    renderRows(cam, scene, canvas, width, height, 0, 1, false);
    var time = (new Date() - start);
    numLines = height; //XXX 20;//Math.max(1,Math.round(500/time)); // try to not exceed 500ms per block
    renderRows(cam, scene, canvas, width, height, 1, 1 + numLines, true);
}
