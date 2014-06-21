Island = {
  displayObjects: new Array(),
  imgData: new Array(),
  canvas: new Object,
  zoomlevel: 0,
  zoomable: true,
  zoomscale: 1.5,
  tempX: new Array(),
  tempY: new Array(),
  objData: new Object,
  objNum: 0,
  playaPos: 0,
  posData: new Object,
  usrX: 0,
  usrY: 0,
  
  
  ini: function(data){
    //Need data parsin' here
    Island.posData = data;
    Island.objData = document.createElement('script');
    Island.objData.src = 'javascripts/displayObjects.jsonp?callback=loadObjData';
    document.head.appendChild(Island.objData);
  },
  
  
  // Initializing all of the display objects.
  loadObjData: function(data){
    Island.objNum = data.count;
    for(var i=0;i<Island.objNum;i++){
      Island.imgData[i] = data.objects[i];
    }
    Island.playaPos = Island.posData.current_user.pos;
    Island.usrX = data.objects[Island.playaPos].x;
    Island.usrY = data.objects[Island.playaPos].y;
    Island.buildMap();
  },
  
  
  buildMap: function(){
    var JScanvas;
    //Creating oCanvas main object
    Island.canvas = oCanvas.create({
      canvas: "#island_canvas"
    });
    //Creating and displaying all objects on canvas: maps, buttons etc.
    for(var i=0;i<Island.objNum;i++){
      Island.displayObjects[i] = Island.canvas.display.image({
        x: Island.imgData[i].x,
        y: Island.imgData[i].y,
        origin: { x: "left", y: "top" },
        image: Island.imgData[i].source
      });
      Island.canvas.addChild(Island.displayObjects[i]);
    }     
    Island.displayObjects[Island.objNum] = Island.canvas.display.image({
      x: Island.usrX,
      y: Island.usrY,
      origin: { x: "left", y: "top" },
      image: "artwork/playa.png"
    });
    Island.canvas.addChild(Island.displayObjects[Island.objNum]);
    //Setting different events.
    JScanvas = document.getElementById("island_canvas");
    JScanvas.addEventListener("mousewheel", Island.zoom, false);  
    JScanvas.addEventListener("DOMMouseScroll", Island.zoom, false);
    //last six objects are always map buttons
    /*Island.displayObjects[Island.objNum-6].bind("click tap", function(){
      Island.pan(1);
    });
    Island.displayObjects[Island.objNum-5].bind("click tap", function(){
      Island.pan(2);
    });
    Island.displayObjects[Island.objNum-4].bind("click tap", function(){
      Island.pan(3);
    });
    Island.displayObjects[Island.objNum-3].bind("click tap", function(){
      Island.pan(4);
    });
    Island.displayObjects[Island.objNum-2].bind("click tap", function(){
      Island.zoombutton(1);
    });
    Island.displayObjects[Island.objNum-1].bind("click tap", function(){
      Island.zoombutton(-1);
    });*/
    
    //Moving the map with mouse
    for(var k=0;k<=Island.objNum;k++)
    {
      Island.displayObjects[k].bind("mousedown", function () {
        Island.zoomable = false;  
        for(var l=0;l<=Island.objNum;l++)
        {
          Island.tempX[l] = Island.canvas.mouse.x - Island.displayObjects[l].x;          
          Island.tempY[l] = Island.canvas.mouse.y - Island.displayObjects[l].y;
        }
        Island.canvas.draw.redraw();
      });
      
      Island.displayObjects[k].bind("mousemove", function () {           
        if(Island.canvas.mouse.buttonState == "down") {
          for(var l=0;l<=Island.objNum;l++)
          {
            Island.displayObjects[l].x = Island.canvas.mouse.x - Island.tempX[l];
            Island.displayObjects[l].y = Island.canvas.mouse.y - Island.tempY[l];
          }
          Island.canvas.draw.redraw();
        }
      });
      
      Island.displayObjects[k].bind("mouseup", function () {
        Island.zoomable = true;  
      });
    }
  },
  
  
  zoombutton: function(zoom){
    //Zooming in with button
    if((zoom == 1) && (Island.zoomlevel<4) && (Island.zoomable == true)) {
      Island.zoomable = false;

      for(var j=0;j<=Island.objNum;j++){
        Island.displayObjects[j].stop().animate({
          height: Island.displayObjects[j].height*Island.zoomscale,
          width: Island.displayObjects[j].width*Island.zoomscale,
          x: Island.canvas.width/2-Island.zoomscale*(Island.canvas.width/2-Island.displayObjects[j].x),
          y: Island.canvas.height/2-Island.zoomscale*(Island.canvas.height/2-Island.displayObjects[j].y)
        }, { 
          duration: 200,
          callback: function(){
            Island.zoomable = true;
          }
        });
      }
      Island.zoomlevel++;
    }

    //Zooming out with button
    else if((zoom == -1) && (Island.zoomlevel>-1) && (Island.zoomable == true)){
      Island.zoomable = false;
      for(var j=0;j<=Island.objNum;j++){
        Island.displayObjects[j].stop().animate(
        {
          height: Math.round(Island.displayObjects[j].height/Island.zoomscale),
          width: Math.round(Island.displayObjects[j].width/Island.zoomscale),
          x: Island.canvas.width/2-(Island.canvas.width/2-Island.displayObjects[j].x)/Island.zoomscale,
          y: Island.canvas.height/2-(Island.canvas.height/2-Island.displayObjects[j].y)/Island.zoomscale
        },
        { 
          duration: 200,
          callback: function(){
            Island.zoomable = true;
          }
        });
      }
      Island.zoomlevel--;
    }
  },
  
  
  pan: function(direction){
    if(direction == 1){
      Island.zoomable = false;
      for(var j=0;j<=Island.objNum;j++){
        Island.displayObjects[j].stop().animate({
          y: Island.displayObjects[j].y + 100
        },
        { 
          duration: 180,
          callback: function(){
            Island.zoomable = true;
          }
        });
      }
    }
    else if(direction == 2){
      Island.zoomable = false;
      for(var j=0;j<=Island.objNum;j++){
        Island.displayObjects[j].stop().animate({
          y: Island.displayObjects[j].y - 100
        },
        { 
          duration: 180,
          callback: function(){
            Island.zoomable = true;
          }
        });
      }
    }
    else if(direction == 3){
      Island.zoomable = false;
      for(var j=0;j<=Island.objNum;j++){
        Island.displayObjects[j].stop().animate({
          x: Island.displayObjects[j].x + 100
        },
        { 
          duration: 180,
          callback: function(){
             Island.zoomable = true;
          }
        });
      }
    }
    else if(direction == 4){
      Island.zoomable = false;
      for(var j=0;j<=Island.objNum;j++){
        Island.displayObjects[j].stop().animate({
          x: Island.displayObjects[j].x - 100
        },
        { 
          duration: 180,
          callback: function(){
            Island.zoomable = true;
          }
        });
      }
    }
    Island.canvas.redraw();
  },
  
  
  zoom: function(e){
    var delta;
    var img;
    img = Island.displayObjects[0];
    //Calculating the spin of the mousewheel
    delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    //Zooming in
    if((delta == 1) && (Island.zoomlevel<4) && (Island.zoomable == true)){
      Island.zoomable = false;
      for(var j=0;j<=Island.objNum;j++){
        Island.displayObjects[j].stop().animate(
        {
          height: Island.displayObjects[j].height*Island.zoomscale,
          width: Island.displayObjects[j].width*Island.zoomscale,
          x: Island.canvas.mouse.x-Island.zoomscale*(Island.canvas.mouse.x-Island.displayObjects[j].x),
          y: Island.canvas.mouse.y-Island.zoomscale*(Island.canvas.mouse.y-Island.displayObjects[j].y)
        },
        { 
          duration: 200,
          callback: function(){
            Island.zoomable = true;
          }
        }
        );
      }
      Island.zoomlevel++;
    } 
    //Zooming out
    else if((delta == -1) && (Island.zoomlevel>-1) && (Island.zoomable == true)){
      Island.zoomable = false;
      for(var j=0;j<=Island.objNum;j++){
        Island.displayObjects[j].stop().animate(
        {
          height: Math.round(Island.displayObjects[j].height/Island.zoomscale),
          width: Math.round(Island.displayObjects[j].width/Island.zoomscale),
          x: Island.canvas.mouse.x-(Island.canvas.mouse.x-Island.displayObjects[j].x)/Island.zoomscale,
          y: Island.canvas.mouse.y-(Island.canvas.mouse.y-Island.displayObjects[j].y)/Island.zoomscale
        },
        { 
          duration: 200,
          callback: function(){
            Island.zoomable = true;
          }
        }
        );
      }
      Island.zoomlevel--;
    }
  },
  renderPositions: function(data) {
    console.log(data);
    Island.ini(data);
  }
}