/*
    visualisation functions for the demo
*/

// just for the demo
function generateRandomMatrix(w, h) {
    var x, y, matrix = [];

    for (var y=0; y<h; y++) {
        matrix[y] = [];

        for (var x=0; x<w; x++)
            matrix[y][x] = Math.random();
    }

    return matrix;
}

function stretchMatrix(matrix, factor, add) {
    var 
        h  = matrix.length,
        w  = matrix[0].length,
        x = 0, y = 0;
        
    for (y=1; y<h-1; y++)
        for (x=1; x<w-1; x++)
            matrix[y][x] = Math.min(Math.max(matrix[y][x] * factor - factor/2 + add, 0), 1);
    
    return matrix;
}

function blurMatrix(matrix) {
    var 
        h  = matrix.length,
        w  = matrix[0].length,
        nm = matrix,
        x = 0, y = 0;
        
    for (y=1; y<h-1; y++) {
        for (x=1; x<w-1; x++) {
            nm[y][x] = 
                (matrix[y-1][x-1] + 
                 matrix[y-1][x  ] + 
                 matrix[y-1][x+1] + 
                 matrix[y  ][x-1] + 
                 matrix[y  ][x  ] + 
                 matrix[y  ][x+1] + 
                 matrix[y+1][x-1] + 
                 matrix[y+1][x  ] +
                 matrix[y+1][x+1]) / 9;
        }
    }
        
    return matrix;
}

function matrixAddBorder(matrix) {
    var 
        h = matrix.length,
        w = matrix[0].length;

    // top and bottom border
    for (var x=0; x<w; x++)
        matrix[0][x] = matrix[h-1][x] = 0;

    // left and right border 
    for (var y=0; y<h; y++)
        matrix[y][0] = matrix[y][w-1] = 0;

    return matrix;
}


// draws a path
function drawPath(canvas, path, color) {
    var ctx = canvas.getContext('2d');

    ctx.fillStyle = color;

    while (path) {
        ctx.fillRect(path.x, path.y, 1, 1);
        path = path.predecessor;
    }
};

// draws a rectangular matrix
function drawMatrix(canvas, matrix) {
    var 
        ctx = canvas.getContext('2d'),
        h = matrix.length,
        w = matrix[0].length;
        
    for (var y=0; y<h; y++)
        for (var x=0; x<w; x++) {
            if (matrix[y][x] != 0) {
                var m = Math.floor(matrix[y][x] * 256);
                ctx.fillStyle = 'rgb(' + [m,m,m].join(', ') + ')';
            } else {
                // unpassable sections
                ctx.fillStyle = 'rgb(255, 0, 255)';
            }
            ctx.fillRect(x, y, 1, 1);
        }
}

function drawNodeArray(canvas, pts, color) {
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = color;

    for (var i=0; i<pts.length; i++)
        ctx.fillRect(pts[i].x, pts[i].y, 1, 1);
}

function getTime() {
    return (new Date()).getTime();
}

function consoleMsg(msg) {
    /*
    if (typeof console != 'undefined' && typeof console.log == "function") {
        console.log(msg);

    } else {
        */

    if (true) {
        var c = $('#console');

        if (c.length == 0) {
            $('body').append('<p><textarea id="console" rows="20" cols="80" readonly="readonly"></textarea></p>');
            var c = $('#console');
        }

        var text = c.val() + msg + "\n";
        
        c.val(text);
    }
}
