var imported;
var displayObjects;
var imgData;
var canvas;
var zoomlevel;
var zoomable;
imported = document.createElement('script');
imported.src = 'javascripts/ocanvas-2.5.1.js';
document.head.appendChild(imported);
zoomlevel = 0;
zoomable = true;
imgData = new Array();
displayObjects = new Array();
//Initializing all of the display objects.(Will have to export to JSON later.)
imgData[0] = {
  source:"map.png",
  x:250,
  y:0
};
imgData[1] = {
  source:"up.png",
  x:100,
  y:0
};
imgData[2] = {
  source:"down.png",
  x:100,
  y:80
};
imgData[3] = {
  source:"left.png",
  x:60,
  y:40
};
imgData[4] = {
  source:"right.png",
  x:140,
  y:40
};
imgData[5] = {
  source:"plus.png",
  x:10,
  y:10
};
imgData[6] = {
  source:"minus.png",
  x:10,
  y:70
};

imported.onload = function (){
  var dragOptions;
  var JScanvas;
  //Creating oCanvas main object
  canvas = oCanvas.create({
    canvas: "#canvas"
  });
  //Creating and displaying all objects on canvas: maps, buttons etc.
  for(var i=0;i<7;i++){
    displayObjects[i] = canvas.display.image({
      x: imgData[i].x,
      y: imgData[i].y,
      origin: { x: "left", y: "top" },
      image: imgData[i].source
    });
    canvas.addChild(displayObjects[i]);
  }
  //Making sure you can't zoom while dragging the map around, makes the map jump around the screen otherwise.
  dragOptions = {
    start: function() {
      zoomable = false;
    },
    end: function() {
      zoomable = true;
    } 
  };
  displayObjects[0].dragAndDrop(dragOptions);
  //Setting different events.
  JScanvas = document.getElementById("canvas");
  JScanvas.addEventListener("mousewheel", zoom, false);  
  JScanvas.addEventListener("DOMMouseScroll", zoom, false);
  displayObjects[1].bind("click tap", function(){
    pan(1);
  });
  displayObjects[2].bind("click tap", function(){
    pan(2);
  });
  displayObjects[3].bind("click tap", function(){
    pan(3);
  });
  displayObjects[4].bind("click tap", function(){
    pan(4);
  });
  displayObjects[5].bind("click tap", function(){
    zoombutton(1);
  });
  displayObjects[6].bind("click tap", function(){
    zoombutton(-1);
  });
}
//Zooming with the + and - buttons.
function zoombutton(zoom){
  //Andrievs, you are up for this job.
}
//Panning the map with directional buttons on screen.
function pan(direction){
  if(direction == 1){
    displayObjects[0].move(0,20);
  }
  else if(direction == 2){
    displayObjects[0].move(0,-20);
  }
  else if(direction == 3){
    displayObjects[0].move(20,0);
  }
  else if(direction == 4){
    displayObjects[0].move(-20,0);
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
      img.stop().animate(
      {
        height: img.height*1.5,
        width: img.width*1.5,
        x: canvas.mouse.x-1.5*(canvas.mouse.x-img.x),
        y: canvas.mouse.y-1.5*(canvas.mouse.y-img.y)  
      },
      { 
        duration: 200,
        callback: function(){
          zoomable = true;
        }
      }
      );
      zoomlevel++;
     } 
     //Zooming out
     else if((delta == -1) && (zoomlevel>-1) && (zoomable == true)){
       zoomable = false;
       img.stop().animate({
         height: Math.round(img.height/1.5),
         width: Math.round(img.width/1.5),
         x: canvas.mouse.x-(canvas.mouse.x-img.x)/1.5,
         y: canvas.mouse.y-(canvas.mouse.y-img.y)/1.5  
       },
       {
         duration: 200,
         callback: function(){
          zoomable = true;
         }
       }  
      );
       zoomlevel--;
     }
}