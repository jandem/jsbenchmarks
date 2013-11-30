/*
Copyright (c) 2010, Liu Liu
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
* Neither the name of the authors nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/*
* Copyright (C) 2012 HDXPRT Development Community
*
* Licensed under the HDXPRT DEVELOPMENT COMMUNITY MEMBER LICENSE AGREEMENT (the "License");
* you may not use this file except in compliance with the License.
*
* You may obtain a copy of the License by contacting Principled Technologies, Inc.
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*
* See the License for the specific language governing grants and
* restrictions under the License.
*/
var image;
var ctx;
var begintimeoutval = 5000;

var numLoaded = 0;
var imagesArray = null;
var startTime = null;
var endTime = null;
var starttimeout = 1000;

var workloadstarttimeout = 10;
var datafile = "getImages_10.txt";
var totalDuration = null;

var cascadeWidth = 0;
var cascadeHeight = 0;

var imgWidth = 0;
var imgHeight = 0;
var val = 0;
var imgSrc = 0;
function getQueryStringValue(key) {
    if (key === "img") return "1";
    if (key === "val") return "0";
	var qs=document.location.search;
	var value;
	qs=qs.substr(1);
	if (qs!="")
	{
		var arr=qs.split("&");
		for(var i=0;i<arr.length;i++)
		{
			var temp_var=arr[i].toLowerCase();
			if (temp_var.indexOf(key.toLowerCase())>-1)
				value=arr[i].split("=")[1];
		}
	}
	return value;
}

var GALLERY = {
	
	container:"#ulImgListBox",
	done: false,
	load: function(filename){
		var _gallery = this;
		$.ajax({
			type: "get",
			success:function(){
	
			var pic_real_width, pic_real_height;		
			$('<img></img>') // Make in memory copy of image to avoid css issues
				.attr("src", '' + filename)
				.load(function() {
				numLoaded++;
				pic_real_width = this.width;   // Note: $(this).width() will not
				pic_real_height = this.height; // work for in memory images.

				var id = 0;
				var newGalleryimg = new galleryImage ($(this).attr('src'),"n" + id ,pic_real_width,pic_real_height);

				cascadeWidth = cascade.width; 
				cascadeHeight = cascade.height;
				//$("#log").html("start detect");
				window.runTest = function() { detectFaces(newGalleryimg, 0); };
				loadHandler();

			});
			_gallery.display(filename,0);
			}
			
		});
	},
	
	display:function(image_url,imgIndex){
	$('<li></li>').append(
       	$('<img></img>')
		.attr('id','imgId' + imgIndex)
		.attr('src','' + image_url)
		.load(function(){
			$(this).fadeIn();
		}))
		.appendTo(this.container);
	}
};
//$(document).ready(function() {      
//      cascadeWidth = cascade.width; 
//      cascadeHeight = cascade.height;
//      imgSrc = getQueryStringValue("img");
//      val = parseInt(getQueryStringValue("val"));
//     $('<img></img>') // Make in memory copy of image to avoid css issues					
//	.attr("src", 'img/' + imgSrc + ".jpg" )
//      //var imageObj = new Image();
//      //
//      //imageObj.onload = function() {
//	//$("#imgPhoto").attr("src", 'img/' + imgSrc + ".jpg" );
//	//imgWidth = $("#imgPhoto").width();
//	//imgHeight = $("#imgPhoto").height();
//	//detectFaces(imgWidth, imgHeight);
//	.load(function() {
//	$("#ulImgListBox").append(
//		$('<li></li>').append(
//		$('<img></img>')
//		.attr('id','imgPhoto')
//		.attr('src','img/' + imgSrc + ".jpg" )
//		.load(function(){
//			$(this).fadeIn();
//		}))
//	)
//	
//	imgWidth = $("#imgPhoto").width();
//	imgHeight = $("#imgPhoto").height();
//	alert("loaded");
//	detectFaces(imgWidth, imgHeight);
//      });
//     // imageObj.src = 'img/' + imgSrc + ".jpg";
//   
//});
$(document).ready(function() {
	jQuery( "#container" ).css( 'left', parseInt( ( jQuery( document ).width() / 2 ) + jQuery( document ).scrollLeft() - jQuery( "#container" ).width() ) );
	
	//var numphotos = getQueryStringValue("numphotos");
	//datafile = "getImages_1.txt";
	//if(numphotos == undefined || numphotos == "35")
	//{
	//     datafile = "getImages_35.txt";
	//}else if( numphotos == "8"){
	//     datafile = "getImages_35.txt";
	//}
	
	//GALLERY.load(datafile);
	imgSrc = getQueryStringValue("img");
	imgSrc = imgSrc + ".jpg";
        val = parseInt(getQueryStringValue("val"));
	GALLERY.load(imgSrc);
	
});

function grayscale(image, w, h) {
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	
	canvas.width  = w;
	canvas.height = h;

	ctx.drawImage(image, 0, 0);
	var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	var data = imageData.data;
	var pix1, pix2, pix = canvas.width * canvas.height * 4;
	while (pix > 0) {
		data[pix -= 4] = data[pix1 = pix + 1] = data[pix2 = pix + 2] = (data[pix] * 0.3 + data[pix1] * 0.59 + data[pix2] * 0.11);
	}
	ctx.putImageData(imageData, 0, 0);
	return canvas;		
}

function preprocess(canvas){
	var interval = 5;
	var min_neighbors = 1;
	var tmpScaleFactor = 1 / (interval + 1)
	var scale = Math.pow(2,tmpScaleFactor );
	var cWidth = cascade.width;
	var cHeight = cascade.height;
	var next = interval + 1;
	var next2 = next << 1;
	var next4 = next << 2;
	var scale_upto = ~~(Math.log(Math.min(cWidth, cHeight)) / Math.log(scale));
	var pyr = new Array((scale_upto + next2) * 4);
	var ret = new Array((scale_upto + next2) * 4);
	pyr[0] = canvas;
	ret[0] = { "width" : pyr[0].width,
			   "height" : pyr[0].height,
			   "data" : pyr[0].getContext("2d").getImageData(0, 0, pyr[0].width, pyr[0].height).data };
	var i;
	for (i = 1; i <= interval; i++) {
		pyr[(i << 2)] = document.createElement("canvas");
		pyr[(i << 2)].width = ~~(pyr[0].width / Math.pow(scale, i));
		pyr[(i << 2)].height = ~~(pyr[0].height / Math.pow(scale, i));
		pyr[(i << 2)].getContext("2d").drawImage(pyr[0], 0, 0, pyr[0].width, pyr[0].height, 0, 0, pyr[(i << 2)].width, pyr[(i << 2)].height);
		ret[(i << 2)] = { "width" : pyr[(i << 2)].width,
					   "height" : pyr[(i << 2)].height,
					   "data" : pyr[(i << 2)].getContext("2d").getImageData(0, 0, pyr[(i << 2)].width, pyr[(i << 2)].height).data };
	}
	for (i = next; i < scale_upto + next2; i++) {
		pyr[(i << 2)] = document.createElement("canvas");
		pyr[(i << 2)].width = ~~(pyr[(i << 2) - next4].width * 0.5);
		pyr[(i << 2)].height = ~~(pyr[(i << 2) - next4].height * 0.5);
		pyr[(i << 2)].getContext("2d").drawImage(pyr[(i << 2) - next4], 0, 0, pyr[(i << 2) - next4].width, pyr[(i << 2) - next4].height, 0, 0, pyr[(i << 2)].width, pyr[(i << 2)].height);
		ret[(i << 2)] = { "width" : pyr[(i << 2)].width,
					   "height" : pyr[(i << 2)].height,
					   "data" : pyr[(i << 2)].getContext("2d").getImageData(0, 0, pyr[(i << 2)].width, pyr[(i << 2)].height).data };
	}
	for (i = next2; i < scale_upto + next2; i++) {
		pyr[(i << 2) + 1] = document.createElement("canvas");
		pyr[(i << 2) + 1].width = ~~(pyr[(i << 2) - next4].width * 0.5);
		pyr[(i << 2) + 1].height = ~~(pyr[(i << 2) - next4].height * 0.5);
		pyr[(i << 2) + 1].getContext("2d").drawImage(pyr[(i << 2) - next4], 1, 0, pyr[(i << 2) - next4].width - 1, pyr[(i << 2) - next4].height, 0, 0, pyr[(i << 2) + 1].width - 2, pyr[(i << 2) + 1].height);
		ret[(i << 2) + 1] = { "width" : pyr[(i << 2) + 1].width,
						   "height" : pyr[(i << 2) + 1].height,
						   "data" : pyr[(i << 2) + 1].getContext("2d").getImageData(0, 0, pyr[(i << 2) + 1].width, pyr[(i << 2) + 1].height).data };
		pyr[(i << 2) + 2] = document.createElement("canvas");
		pyr[(i << 2) + 2].width = ~~(pyr[(i << 2) - next4].width * 0.5);
		pyr[(i << 2) + 2].height = ~~(pyr[(i << 2) - next4].height * 0.5);
		pyr[(i << 2) + 2].getContext("2d").drawImage(pyr[(i << 2) - next4], 0, 1, pyr[(i << 2) - next4].width, pyr[(i << 2) - next4].height - 1, 0, 0, pyr[(i << 2) + 2].width, pyr[(i << 2) + 2].height - 2);
		ret[(i << 2) + 2] = { "width" : pyr[(i << 2) + 2].width,
						   "height" : pyr[(i << 2) + 2].height,
						   "data" : pyr[(i << 2) + 2].getContext("2d").getImageData(0, 0, pyr[(i << 2) + 2].width, pyr[(i << 2) + 2].height).data };
		pyr[(i << 2) + 3] = document.createElement("canvas");
		pyr[(i << 2) + 3].width = ~~(pyr[(i << 2) - next4].width * 0.5);
		pyr[(i << 2) + 3].height = ~~(pyr[(i << 2) - next4].height * 0.5);
		pyr[(i << 2) + 3].getContext("2d").drawImage(pyr[(i << 2) - next4], 1, 1, pyr[(i << 2) - next4].width - 1, pyr[(i << 2) - next4].height - 1, 0, 0, pyr[(i << 2) + 3].width - 2, pyr[(i << 2) + 3].height - 2);
		ret[(i << 2) + 3] = { "width" : pyr[(i << 2) + 3].width,
						   "height" : pyr[(i << 2) + 3].height,
						   "data" : pyr[(i << 2) + 3].getContext("2d").getImageData(0, 0, pyr[(i << 2) + 3].width, pyr[(i << 2) + 3].height).data };
	}
	
	return ret;
}
function detectFaces(gImg,imgNum){

	startTime = new Date().getTime();
	var img=document.getElementById('imgId' + imgNum);
	var canvas = grayscale(img, gImg.o_width, gImg.o_height );
	//start pre processing	
	var ret = preprocess(canvas);
	var coords = null;
	var interval = 5;
	var min_neighbors = 1;
	var tmpScaleFactor =  1 / (interval + 1);
	var scale = Math.pow(2, tmpScaleFactor);
	var next = interval + 1;
	
	//var scale_upto = Math.floor(Math.log(Math.min(cascade.width, cascade.height)) / Math.log(scale));
	var scale_upto = Math.floor(Math.log(Math.min(cascadeWidth, cascadeHeight)) / Math.log(scale));
	coords = detect(ret,cascade,interval,scale,next,scale_upto,min_neighbors);
	
	
	totalDuration += new Date().getTime() - startTime;
	val += totalDuration;
	if(coords.length >0 ){
	 $("#status").text("Face(s) detected");	
	}else{
	  $("#status").text(" No face(s) detected");		
	}
        reportTestResult(totalDuration);
	//var arrPos = getQueryStringValue("arrPos");
	//var testIndex= getQueryStringValue("testIndex");
	//var run = getQueryStringValue("run");
	//setTimeout(function(){window.location = serverUrl + 'facedetect/facedetect.php?val=' + val + '&img=' + imgSrc + '&arrPos=' + arrPos + '&testIndex=' + testIndex + '&run=' + run}, globalWorkloadTimeout);
}


function detect(pyr,cascade,interval,scale,next,scale_upto,min_neighbors) {
	for (j = 0; j < cascade.stage_classifier.length; j++)
		cascade.stage_classifier[j].orig_feature = cascade.stage_classifier[j].feature;

	var i, j, k, x, y, q;
	var scale_x = 1, scale_y = 1;
	var dx = [0, 1, 0, 1];
	var dy = [0, 0, 1, 1];
	var seq = [];
	var cWidth = cascade.width;
	var cHeight = cascade.height;
	var cWqtr = ~~(cWidth * 0.25);
	var cHqtr = ~~(cHeight * 0.25);
	var next2 = next << 1;
	var next4 = next << 2;
	var next8 = next << 3;
	for (i = 0; i < scale_upto; i++) {
		var qw = pyr[(i << 2) + next8].width - cWqtr;
		var qh = pyr[(i << 2) + next8].height - cHqtr;
		var step = [pyr[(i << 2)].width * 4, pyr[(i << 2) + next4].width * 4, pyr[(i << 2) + next8].width * 4];
		var paddings = [pyr[(i << 2)].width * 16 - qw * 16,
						pyr[(i << 2) + next4].width * 8 - qw * 8,
						pyr[(i << 2) + next8].width * 4 - qw * 4];
		for (j = 0; j < cascade.stage_classifier.length; j++) {
			var orig_feature = cascade.stage_classifier[j].orig_feature;
			var feature = cascade.stage_classifier[j].feature = new Array(cascade.stage_classifier[j].count);
			for (k = 0; k < cascade.stage_classifier[j].count; k++) {
				feature[k] = {"size" : orig_feature[k].size,
							  "px" : new Array(orig_feature[k].size),
							  "pz" : new Array(orig_feature[k].size),
							  "nx" : new Array(orig_feature[k].size),
							  "nz" : new Array(orig_feature[k].size)};
				for (q = 0; q < orig_feature[k].size; q++) {
					feature[k].px[q] = orig_feature[k].px[q] * 4 + orig_feature[k].py[q] * step[orig_feature[k].pz[q]];
					feature[k].pz[q] = orig_feature[k].pz[q];
					feature[k].nx[q] = orig_feature[k].nx[q] * 4 + orig_feature[k].ny[q] * step[orig_feature[k].nz[q]];
					feature[k].nz[q] = orig_feature[k].nz[q];
				}
			}
		}
		for (q = 0; q < 4; q++) {
			var u8 = [pyr[(i << 2)].data, pyr[(i << 2) + next4].data, pyr[(i << 2) + next8 + q].data];
			var u8o = [dx[q] * 8 + dy[q] * pyr[(i << 2)].width * 8, dx[q] * 4 + dy[q] * pyr[(i << 2) + next4].width * 4, 0];
			for (y = 0; y < qh; y++) {
				for (x = 0; x < qw; x++) {
					var sum = 0;
					var flag = true;
					for (j = 0; j < cascade.stage_classifier.length; j++) {
						sum = 0;
						var alpha = cascade.stage_classifier[j].alpha;
						var feature = cascade.stage_classifier[j].feature;
						for (k = 0; k < cascade.stage_classifier[j].count; k++) {
							var feature_k = feature[k];
							var p, pmin = u8[feature_k.pz[0]][u8o[feature_k.pz[0]] + feature_k.px[0]];
							var n, nmax = u8[feature_k.nz[0]][u8o[feature_k.nz[0]] + feature_k.nx[0]];
							if (pmin <= nmax) {
								sum += alpha[k << 1];
							} else {
								var f, shortcut = true;
								for (f = 0; f < feature_k.size; f++) {
									if (feature_k.pz[f] >= 0) {
										p = u8[feature_k.pz[f]][u8o[feature_k.pz[f]] + feature_k.px[f]];
										if (p < pmin) {
											if (p <= nmax) {
												shortcut = false;
												break;
											}
											pmin = p;
										}
									}
									if (feature_k.nz[f] >= 0) {
										n = u8[feature_k.nz[f]][u8o[feature_k.nz[f]] + feature_k.nx[f]];
										if (n > nmax) {
											if (pmin <= n) {
												shortcut = false;
												break;
											}
											nmax = n;
										}
									}
								}
								sum += (shortcut) ? alpha[(k << 1) + 1] : alpha[k << 1];
							}
						}
						if (sum < cascade.stage_classifier[j].threshold) {
							flag = false;
							break;
						}
					}
					if (flag) {
						seq.push({"x" : (x * 4 + dx[q] * 2) * scale_x,
								  "y" : (y * 4 + dy[q] * 2) * scale_y,
								  "width" : cWidth * scale_x,
								  "height" : cHeight * scale_y,
								  "neighbor" : 1,
								  "confidence" : sum});
					}
					u8o[0] += 16;
					u8o[1] += 8;
					u8o[2] += 4;
				}
				u8o[0] += paddings[0];
				u8o[1] += paddings[1];
				u8o[2] += paddings[2];
			}
		}
		scale_x *= scale;
		scale_y *= scale;
	}
	//return seq;
	var i, j;
	for (i = 0; i < cascade.stage_classifier.length; i++)
		cascade.stage_classifier[i].feature = cascade.stage_classifier[i].orig_feature;
	//seq = seq[0];
	//return seq;
	if (!(min_neighbors > 0))
		return seq;
	else {
		var result = array_group(seq, function (r1, r2) {
					var distance = ~~(r1.width * 0.25 + 0.5);

					return r2.x <= r1.x + distance &&
						   r2.x >= r1.x - distance &&
						   r2.y <= r1.y + distance &&
						   r2.y >= r1.y - distance &&
						   r2.width <= ~~(r1.width * 1.5 + 0.5) &&
						   ~~(r2.width * 1.5 + 0.5) >= r1.width;
				});
				
		
		var ncomp = result.cat;
		
		var idx_seq = result.index;
		var comps = new Array(ncomp + 1);
		for (i = 0; i < comps.length; i++)
			comps[i] = {"neighbors" : 0,
						"x" : 0,
						"y" : 0,
						"width" : 0,
						"height" : 0,
						"confidence" : 0};
		//return comps.length;
		//return seq.length;
//		// count number of neighbors
		for(i = 0; i < seq.length; i++)
		{
			var r1 = seq[i];
			var idx = idx_seq[i];

			if (comps[idx].neighbors == 0)
				comps[idx].confidence = r1.confidence;

			++comps[idx].neighbors;

			comps[idx].x += r1.x;
			comps[idx].y += r1.y;
			comps[idx].width += r1.width;
			comps[idx].height += r1.height;
			comps[idx].confidence = Math.max(comps[idx].confidence, r1.confidence);
		}
		
		var seq2 = [];
		// calculate average bounding box
		for(i = 0; i < ncomp; i++)
		{
			var n = comps[i].neighbors;
			if (n >= min_neighbors)
				seq2.push({"x" : (comps[i].x * 2 + n) / (2 * n),
						   "y" : (comps[i].y * 2 + n) / (2 * n),
						   "width" : (comps[i].width * 2 + n) / (2 * n),
						   "height" : (comps[i].height * 2 + n) / (2 * n),
						   "neighbors" : comps[i].neighbors,
						   "confidence" : comps[i].confidence});
		}
		
		var result_seq = [];
		for(i = 0; i < seq2.length; i++)
				{
					var r1 = seq2[i];
					var flag = true;
					for(j = 0; j < seq2.length; j++)
					{
						var r2 = seq2[j];
						var distance = ~~(r2.width * 0.25 + 0.5);

						if(i != j &&
						   r1.x >= r2.x - distance &&
						   r1.y >= r2.y - distance &&
						   r1.x + r1.width <= r2.x + r2.width + distance &&
						   r1.y + r1.height <= r2.y + r2.height + distance &&
						   (r2.neighbors > Math.max(3, r1.neighbors) || r1.neighbors < 3))
						{
							flag = false;
							break;
						}
					}

					if(flag)
						result_seq.push(r1);
		}
		return result_seq;
	}
}

function array_group  (seq, gfunc) {
	var i, j;
	var node = new Array(seq.length);
	for (i = 0; i < seq.length; i++)
		node[i] = {"parent" : -1,
				   "element" : seq[i],
				   "rank" : 0};
	for (i = 0; i < seq.length; i++) {
		if (!node[i].element)
			continue;
		var root = i;
		while (node[root].parent != -1)
			root = node[root].parent;
		for (j = 0; j < seq.length; j++) {
			if( i != j && node[j].element && gfunc(node[i].element, node[j].element)) {
				var root2 = j;

				while (node[root2].parent != -1)
					root2 = node[root2].parent;

				if(root2 != root) {
					if(node[root].rank > node[root2].rank)
						node[root2].parent = root;
					else {
						node[root].parent = root2;
						if (node[root].rank == node[root2].rank)
						node[root2].rank++;
						root = root2;
					}

					/* compress path from node2 to the root: */
					var temp, node2 = j;
					while (node[node2].parent != -1) {
						temp = node2;
						node2 = node[node2].parent;
						node[temp].parent = root;
					}

					/* compress path from node to the root: */
					node2 = i;
					while (node[node2].parent != -1) {
						temp = node2;
						node2 = node[node2].parent;
						node[temp].parent = root;
					}
				}
			}
		}
	}
	var idx = new Array(seq.length);
	var class_idx = 0;
	for(i = 0; i < seq.length; i++) {
		j = -1;
		var node1 = i;
		if(node[node1].element) {
			while (node[node1].parent != -1)
				node1 = node[node1].parent;
			if(node[node1].rank >= 0)
				node[node1].rank = ~class_idx++;
			j = ~node[node1].rank;
		}
		idx[i] = j;
	}
	return {"index" : idx, "cat" : class_idx};
}
