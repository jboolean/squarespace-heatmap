var REQUEST_URL = '/';

var drawIndicator = function(pos, clicks, hovers, maxClicks, maxHovers) {
  if (hovers === 0 && clicks === 0) {
    return;
  }
  var el = document.createElement('div');
  // <div class="one"><span class="clicksonhover">1.8K</span></div>
  el.className = 'indicator';
  el.style.left = pos.x;
  el.style.top = pos.y;

  var circle = document.createElement('div');
  circle.className = 'circle';


  var clickRatio = clicks/maxClicks;
  var animationDuration = 3.6 - (clickRatio * (3.0 - 0.6) + 0.6);
  circle.style.animationDuration = animationDuration + 's';

  var hoverRatio = hovers/maxHovers;
  var size = hoverRatio * (80 - 22) + 22;
  circle.style.width = circle.style.height = size + 'px';

  el.appendChild(circle);

  document.getElementById('indicators').appendChild(el);

  var label = document.createElement('div');
  label.className = 'clicksonhover';
  label.appendChild(document.createTextNode(clicks));
  // label.style.marginLeft = label.style.marginTop = size/2 + 'px';
  el.appendChild(label);
};

var drawIndicators = function(data) {
  var maxClicks = 0;
  var maxHovers = 0;
  for (var elId in data) {
    if (data[elId].clicks > maxClicks) {
      maxClicks = data[elId].clicks;
    }
    if (data[elId].hovers > maxHovers) {
      maxHovers = data[elId].hovers;
    }
  }

  for (elId in data) {
    var doc = document.getElementById('pageView').contentDocument;
    var bb = doc.getElementById(elId).getBoundingClientRect();

    var middle = {
      x: bb.left + (bb.right - bb.left)/2,
      y: bb.top + (bb.bottom - bb.top)/2
    };

    // if (elId === 'block-20d2d7d07ef691626788' || elId === 'block-9b68428d3dc4235f06c2')
    drawIndicator(middle, data[elId].clicks || 0, data[elId].hovers || 0, maxClicks, maxHovers);
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
