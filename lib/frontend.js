var REQUEST_URL = '/';

var dataLoaded = function(e) {
  var response = JSON.parse(e.target.responseText);
  debugger;
};

var goToUrl = function(url) {
  var frame = document.getElementById('pageView');
  frame.src = url;

  frame.onload = function(e) {
    var doc = e.target.contentDocument;
    var trackedElements = doc.querySelectorAll('.sqs-block');

    var formData = new FormData();
    var id;
    var url = REQUEST_URL + '?';

    for (var i = 0; i < trackedElements.length; i++) {
      id = trackedElements[i].getAttribute('id');
      url += encodeURIComponent(id) + '=clicks&';
      url += encodeURIComponent(id) + '=hovers&';
    }

    var request = new XMLHttpRequest();
    request.onload = dataLoaded;
    request.open('GET', url);
    request.send();
  }
};

window.addEventListener('DOMContentLoaded',function() {
  document.getElementById('urlBar').onkeydown = function(e) {
    if (e.keyCode === 13) {
      goToUrl(e.target.value);
    }
  };
});