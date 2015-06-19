var REQUEST_URL = '/';

var drawIndicator = function(pos, clicks, hovers) {
  var el = document.createElement('div');
  // <div class="one"><span class="clicksonhover">1.8K</span></div>
  el.className = 'indicator';
  el.style.left = pos.x;
  el.style.top = pos.y;

  document.getElementById('indicators').appendChild(el);

  var span = document.createElement('span');
  span.className = 'clicksonhover';
  span.appendChild(document.createTextNode(clicks));
  el.appendChild(span);
};

var drawIndicators = function(data) {
  for (var elId in data) {
    var doc = document.getElementById('pageView').contentDocument;
    var bb = doc.getElementById(elId).getBoundingClientRect();

    var middle = {
      x: bb.left + (bb.right - bb.left)/2,
      y: bb.top + (bb.bottom - bb.top)/2
    };

    // if (elId === 'block-20d2d7d07ef691626788' || elId === 'block-9b68428d3dc4235f06c2')
    drawIndicator(middle, data[elId].clicks, data[elId].hovers);
  }
};

var dataLoaded = function(e) {
  drawIndicators(JSON.parse(e.target.responseText));
};

var goToUrl = function(url) {
  var frame = document.getElementById('pageView');
  frame.src = url;

  frame.onload = function(e) {
    var doc = e.target.contentDocument;

    e.target.contentWindow.onscroll = function(e) {
      var indicators = document.getElementById('indicators');
      var scroll = document.getElementById('pageView').contentWindow.scrollY;
      indicators.style.top = -scroll + 48;
      // indicators.style.height = e.target.contentWindow.scrollHeight;
    };

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
  };
};

window.addEventListener('DOMContentLoaded',function() {
  document.getElementById('urlBar').onkeydown = function(e) {
    if (e.keyCode === 13) {
      goToUrl(e.target.value);
    }
  };

});
