var imported;
var displayObjects;
var imgData;
var canvas;
var zoomlevel;
var zoomable;
var zoomscale;
var tempX;
var tempY;
var objData;
var objNum;
var playaPos;
var posData;
var usrX;
var usrY;

Island.infi = function(data) {

}

Island = {
  imported;
  displayObjects: 
  imgData:

  init: function(data) {...}
  
  controls: {
    zoomin: function(...) {

    }
    zoomout...
  }
}

function ini(data){  
  //Need data parsin' here
  posData = data;
  zoomlevel = 0;
  zoomscale = 1.5;
  zoomable = true;
  tempX = new Array();
  tempY = new Array();
  imgData = new Array();
  displayObjects = new Array();
  objData = document.createElement('script');
  objData.src = 'javascripts/displayObjects.jsonp?callback=loadObjData';
  document.head.appendChild(objData);
}

// Initializing all of the display objects.
function loadObjData(data){
  objNum = data.count;
  for(var i=0;i<objNum;i++){
    imgData[i] = data.objects[i];
  }
  //depends on the way we receive data, will have to ask
  // for(var i=1;i<objNum-7;i++){
    // if(posData.positions[i].current == true){
      playaPos = posData.current_user.pos;
      usrX = posData.positions[playaPos].x;
      usrY = posData.positions[playaPos].y;
   // }
 // }
  buildMap();
}

function buildMap (){
  var JScanvas;
  //Creating oCanvas main object
  canvas = oCanvas.create({
    canvas: "#canvas"
  });
  //Creating and displaying all objects on canvas: maps, buttons etc.
  for(var i=0;i<objNum;i++){
    displayObjects[i] = canvas.display.image({
      x: imgData[i].x,
      y: imgData[i].y,
      origin: { x: "left", y: "top" },
      image: imgData[i].source
    });
    canvas.addChild(displayObjects[i]);
  }     
  //Setting different events.
  JScanvas = document.getElementById("canvas");
  JScanvas.addEventListener("mousewheel", zoom, false);  
  JScanvas.addEventListener("DOMMouseScroll", zoom, false);
  //last six objects are always map buttons
  displayObjects[objNum-7].move(usrX,usrY);
  displayObjects[objNum-6].bind("click tap", function(){
    pan(1);
  });
  displayObjects[objNum-5].bind("click tap", function(){
    pan(2);
  });
  displayObjects[objNum-4].bind("click tap", function(){
    pan(3);
  });
  displayObjects[objNum-3].bind("click tap", function(){
    pan(4);
  });
  displayObjects[objNum-2].bind("click tap", function(){
    zoombutton(1);
  });
  displayObjects[objNum-1].bind("click tap", function(){
    zoombutton(-1);
  });
  //Moving the map with mouse
  for(var k=0;k<objNum-6;k++)
  {
    displayObjects[k].bind("mousedown", function () {
      zoomable = false;  
	  for(var l=0;l<objNum-6;l++)
	  {
        tempX[l] = canvas.mouse.x - displayObjects[l].x;          
        tempY[l] = canvas.mouse.y - displayObjects[l].y;
      }
	  canvas.draw.redraw();
    });
    displayObjects[k].bind("mousemove", function () {           
      if(canvas.mouse.buttonState == "down") {
	    for(var l=0;l<objNum-6;l++)
	    {
          displayObjects[l].x = canvas.mouse.x - tempX[l];
          displayObjects[l].y = canvas.mouse.y - tempY[l];
	    }
	    canvas.draw.redraw();
      }
    });
    displayObjects[k].bind("mouseup", function () {
      zoomable = true;  
    });
  }
}

//Zooming with the + and - buttons.
function zoombutton(zoom){
  //Zooming in with button
  if((zoom == 1) && (zoomlevel<4) && (zoomable == true)) {
    zoomable = false;

    for(var j=0;j<objNum-6;j++){
      displayObjects[j].stop().animate({
        height: displayObjects[j].height*zoomscale,
        width: displayObjects[j].width*zoomscale,
        x: canvas.width/2-zoomscale*(canvas.width/2-displayObjects[j].x),
        y: canvas.height/2-zoomscale*(canvas.height/2-displayObjects[j].y)
      }, { 
        duration: 200,
        callback: function(){
          zoomable = true;
        }
      });
    }

    zoomlevel++;
   }

   //Zooming out with button
   else if((zoom == -1) && (zoomlevel>-1) && (zoomable == true)){
     zoomable = false;
  for(var j=0;j<objNum-6;j++){
    displayObjects[j].stop().animate(
	{
        height: Math.round(displayObjects[j].height/zoomscale),
         width: Math.round(displayObjects[j].width/zoomscale),
         x: canvas.width/2-(canvas.width/2-displayObjects[j].x)/zoomscale,
         y: canvas.height/2-(canvas.height/2-displayObjects[j].y)/zoomscale
	},
      { 
        duration: 200,
      callback: function(){
          zoomable = true;
          }
      }
      );
  }
     zoomlevel--;
   }
}

//Panning the map with directional buttons on screen.
function pan(direction){
  if(direction == 1){
    zoomable = false;
	 for(var j=0;j<objNum-6;j++){
	  displayObjects[j].stop().animate({
      y: displayObjects[j].y + 100},
      { 
        duration: 180,
	    callback: function(){
          zoomable = true;
          }
      }
      );
	}
  }
  else if(direction == 2){
    zoomable = false;
	for(var j=0;j<objNum-6;j++){
	  displayObjects[j].stop().animate({
      y: displayObjects[j].y - 100},
      { 
        duration: 180,
	    callback: function(){
          zoomable = true;
          }
      }
      );
	}
  }
  else if(direction == 3){
    zoomable = false;
	for(var j=0;j<objNum-6;j++){
	  displayObjects[j].stop().animate({
      x: displayObjects[j].x + 100},
      { 
        duration: 180,
	    callback: function(){
          zoomable = true;
          }
      }
      );
	}
  }
  else if(direction == 4){
    zoomable = false;
	for(var j=0;j<objNum-6;j++){
	  displayObjects[j].stop().animate({
      x: displayObjects[j].x - 100},
      { 
        duration: 180,
	    callback: function(){
          zoomable = true;
          }
      }
      );
	}
  }
  canvas.redraw();
}

function zoom(e) {
  var delta;
  var img;
  img = displayObjects[0];
  //Calculating the spin of the mousewheel
  delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    //Zooming in
    if((delta == 1) && (zoomlevel<4) && (zoomable == true)){
      zoomable = false;
	  for(var j=0;j<objNum-6;j++){
	    displayObjects[j].stop().animate(
		{
          height: displayObjects[j].height*zoomscale,
          width: displayObjects[j].width*zoomscale,
          x: canvas.mouse.x-zoomscale*(canvas.mouse.x-displayObjects[j].x),
          y: canvas.mouse.y-zoomscale*(canvas.mouse.y-displayObjects[j].y)
		},
        { 
          duration: 200,
	      callback: function(){
            zoomable = true;
            }
        }
        );
	  }
      zoomlevel++;
     } 
     //Zooming out
     else if((delta == -1) && (zoomlevel>-1) && (zoomable == true)){
       zoomable = false;
       for(var j=0;j<objNum-6;j++){
	     displayObjects[j].stop().animate(
		 {
           height: Math.round(displayObjects[j].height/zoomscale),
            width: Math.round(displayObjects[j].width/zoomscale),
            x: canvas.mouse.x-(canvas.mouse.x-displayObjects[j].x)/zoomscale,
            y: canvas.mouse.y-(canvas.mouse.y-displayObjects[j].y)/zoomscale
		 },
         { 
           duration: 200,
	       callback: function(){
             zoomable = true;
             }
         }
         );
       }
       zoomlevel--;
     }
}
