var Tracker = require('./tracker.js');

/**
 * This is the script that should be included on websites to track.
 * It tracks events and reports them.
 */

var sendTrackingData = function(tracker) {
  console.log(tracker.getHoverScores());
  tracker.resetHoverScores();
};

window.addEventListener('DOMContentLoaded',function() {
  //run it
  var pageTracker = new Tracker();
  pageTracker.trackHovers();

  setInterval(function() {
    sendTrackingData(pageTracker);
  }, 5000);
},false);