(function() {
  window.Island = {};  
  var head; 
  var script;
  var script2;
  head = document.getElementsByTagName('head')[0];
  script2 = document.createElement('script');
  script2.src = 'javascripts/ocanvas-2.5.1.js';
  head.appendChild(script2);
  script = document.createElement('script');
  script.src = 'javascripts/island.js';
  head.appendChild(script);
  // Loads positions using JSONP
  script.onload = function() {
    script = document.createElement('script');
    script.src = 'javascripts/example.jsonp?callback=Island.renderPositions';
    head.appendChild(script);
  };  
})();
