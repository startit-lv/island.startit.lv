var imported;
var img;
var canvas;
var zoomlevel;
var zoomable;
imported = document.createElement('script');
imported.src = 'javascripts/ocanvas-2.5.1.js';
document.head.appendChild(imported);
zoomlevel = 0;
zoomable = true;

imported.onload = function (){
  var dragOptions;
  var JScanvas;
  canvas = oCanvas.create({
    canvas: "#canvas"
  });
  img = canvas.display.image({
    x: 250,
    y: 0,
    origin: { x: "left", y: "top" },
    image: "map.png"
  });

  canvas.addChild(img);
  dragOptions = {
    start: function() {
      zoomable = false;
    },
    end: function() {
      zoomable = true;
    },
    changeZindex: true  
  };
  img.dragAndDrop(dragOptions);

  JScanvas = document.getElementById("canvas");
  JScanvas.addEventListener("mousewheel", zoom, false);  
  JScanvas.addEventListener("DOMMouseScroll", zoom, false);
}

function zoom(e) {
  var delta;
  delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
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