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

  var hoverScores = tracker.resetHoverScores();
  var clickScores = tracker.resetClickScores();

  for (var id in hoverScores) {
    if (!combined[id]) {
      combined[id] = {hovers: hoverScores[id]};
    } else {
      combined[id].hovers = hoverScores[id];
    }
  }

  for (id in clickScores) {
    if (!combined[id]) {
      combined[id] = {hovers: clickScores[id]};
    } else {
      combined[id].hovers = clickScores[id];
    }
  }

  var formData = new FormData();
  for (id in combined) {
    formData.append(id, '[' + combined[id].clicks +', '+ combined[id].hovers +']');
  }

  var request = new XMLHttpRequest();
  request.open('POST', DATA_URL);
  request.send(formData);
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