var Tracker = require('./tracker.js');

var THIS_FILE_NAME = 'reporter.js';

var scriptTags = document.querySelectorAll('script[src]');

var SCRIPT_DOMAIN;
// Find the domain of this script.
for (var i = 0; i < scriptTags.length; ++i) {
  var src = scriptTags[i].getAttribute('src');
  if (src.endsWith(THIS_FILE_NAME)) {
    SCRIPT_DOMAIN = src.match(/^https?:\/\/[^\/]*(\/|$)/)[0];
    console.log(SCRIPT_DOMAIN);
    break;
  }
}

//URL to which data can be POSTed.
var DATA_URL = SCRIPT_DOMAIN;

/**
 * This is the script that should be included on websites to track.
 * It tracks events and reports them.
 */

var sendTrackingData = function(tracker) {
  var combined = {};

  var hoverScores = tracker.getHoverScores();
  var clickScores = tracker.getClickScores();

  for (var id in hoverScores) {
    if (!combined[id]) {
      combined[id] = {hovers: hoverScores[id]};
    } else {
      combined[id].hovers = hoverScores[id];
    }
  }

  for (id in clickScores) {
    if (!combined[id]) {
      combined[id] = {clicks: clickScores[id]};
    } else {
      combined[id].clicks = clickScores[id];
    }
  }

  console.log(combined);
  var formData = new FormData();
  for (id in combined) {
    var clicks = combined[id].clicks ? combined[id].clicks : 0;
    var hovers = combined[id].hovers ? combined[id].hovers : 0;
    formData.append(id, '[' + clicks +', '+ hovers +']');
  }
  var request = new XMLHttpRequest();
  request.open('POST', DATA_URL);
  request.send(formData);
  var hoverScores = tracker.resetHoverScores();
  var clickScores = tracker.resetClickScores();
};

window.addEventListener('DOMContentLoaded',function() {
  //run it
  var pageTracker = new Tracker();
  pageTracker.trackHovers();
  pageTracker.trackClicks();

  setInterval(function() {
    sendTrackingData(pageTracker);
  }, 5000);
});
