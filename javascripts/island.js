var imported;
var displayObjects;
var imgData;
var canvas;
var zoomlevel;
var zoomable;
var zoomscale;
var tempX;
var tempY;
imported = document.createElement('script');
imported.src = 'javascripts/ocanvas-2.5.1.js';
document.head.appendChild(imported);
zoomlevel = 0;
zoomscale = 1.5;
zoomable = true;
tempX = new Array();
tempY = new Array();
imgData = new Array();
displayObjects = new Array();
//Initializing all of the display objects.(Will have to export to JSON later.)
imgData[0] = {
  source:"artwork/map.png",
  x:300,
  y:0
};
imgData[1] = {
  source:"artwork/snake.png",
  x:400,
  y:75
};
imgData[2] = {
  source:"artwork/snake.png",
  x:400,
  y:375
};
imgData[3] = {
  source:"artwork/snake.png",
  x:900,
  y:40
};
imgData[4] = {
  source:"artwork/snake.png",
  x:700,
  y:275
};
imgData[5] = {
  source:"artwork/up.png",
  x:100,
  y:0
};
imgData[6] = {
  source:"artwork/down.png",
  x:100,
  y:80
};
imgData[7] = {
  source:"artwork/left.png",
  x:60,
  y:40
};
imgData[8] = {
  source:"artwork/right.png",
  x:140,
  y:40
};
imgData[9] = {
  source:"artwork/plus.png",
  x:10,
  y:20
};
imgData[10] = {
  source:"artwork/minus.png",
  x:10,
  y:75
};

imported.onload = function (){
  var JScanvas;
  //Creating oCanvas main object
  canvas = oCanvas.create({
    canvas: "#canvas"
  });
  //Creating and displaying all objects on canvas: maps, buttons etc.
  for(var i=0;i<11;i++){
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
  displayObjects[5].bind("click tap", function(){
    pan(1);
  });
  displayObjects[6].bind("click tap", function(){
    pan(2);
  });
  displayObjects[7].bind("click tap", function(){
    pan(3);
  });
  displayObjects[8].bind("click tap", function(){
    pan(4);
  });
  displayObjects[9].bind("click tap", function(){
    zoombutton(1);
  });
  displayObjects[10].bind("click tap", function(){
    zoombutton(-1);
  });
  
  //Moving the map with mouse
  for(var k=0;k<5;k++)
  {
    displayObjects[k].bind("mousedown", function () {
      zoomable = false;  
	  for(var l=0;l<5;l++)
	  {
        tempX[l] = canvas.mouse.x - displayObjects[l].x;          
        tempY[l] = canvas.mouse.y - displayObjects[l].y;
      }
	  canvas.draw.redraw();
    });
    displayObjects[k].bind("mousemove", function () {           
      if(canvas.mouse.buttonState == "down") {
	    for(var l=0;l<5;l++)
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
    if((zoom == 1) && (zoomlevel<4) && (zoomable == true)){
      zoomable = false;
	  for(var j=0;j<5;j++){
	    displayObjects[j].stop().animate(
		{
          height: displayObjects[j].height*zoomscale,
          width: displayObjects[j].width*zoomscale,
          x: canvas.width/2-zoomscale*(canvas.width/2-displayObjects[j].x),
          y: canvas.height/2-zoomscale*(canvas.height/2-displayObjects[j].y)
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
     //Zooming out with button
     else if((zoom == -1) && (zoomlevel>-1) && (zoomable == true)){
       zoomable = false;
	  for(var j=0;j<5;j++){
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
	for(var j=0;j<5;j++){
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
	for(var j=0;j<5;j++){
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
	for(var j=0;j<5;j++){
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
	for(var j=0;j<5;j++){
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
	  for(var j=0;j<5;j++){
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
       for(var j=0;j<5;j++){
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
