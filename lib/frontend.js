var goToUrl = function(url) {
  var frame = document.getElementById('pageView');
  frame.src = url;
};

window.addEventListener('DOMContentLoaded',function() {
  document.getElementById('urlBar').onkeydown = function(e) {
    if (e.keyCode === 13) {
      goToUrl(e.target.value);
    }
  };
});