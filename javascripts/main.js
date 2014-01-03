(function() {

  window.Island = {};

  Island.renderPositions = function(data) {
    console.log(data);
  };

  // Loads positions using JSONP
  Island.getPositions = function() {
    var head, script;
    head = document.getElementsByTagName('head')[0];
    script = document.createElement('script');
    script.src = '/example.jsonp?callback=Island.renderPositions';
    head.appendChild(script);
  };

  Island.getPositions();

})();
