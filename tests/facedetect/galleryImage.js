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
// JavaScript Document
function galleryImage (src,idStr, w, h){
	this.imgEl = null;
	this.imgId = null;
	this.source = src;
	this.o_width = 0;
	this.o_height = 0;
	this.numFaces = 0;
	this.initgalleryImage(src,idStr,w,h);
}
galleryImage.prototype.initgalleryImage = function(source,idStr,w,h) {
	idStr = "gImgId" + idStr;
	var newImgEl =  $(document.createElement("img"))
		.attr({ src: source,id:idStr,width:0,height:0});
	this.imgId = idStr;
	this.imgEl = newImgEl;
	this.o_width = w;
	this.o_height = h;
	$("body").append(newImgEl);
}
galleryImage.prototype.changeClass = function(classNameStr) {
	this.imgEl.addClass(classNameStr);
}
