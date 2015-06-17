var TimeoutStopwatch = require('./timeoutStopwatch');
var Tracker = require('./reporter');

/**
 * This is the script that should be included on websites to track.
 * It tracks events and reports them.
 */

var getTrackedAncestor = function(child) {
  var node = child;

  while (!node.matches('.sqs-block')) {
    node = node.parentNode;
    if (node === null || node === document) {
      return null;
    }
  }

  return node;
};

var getTrackedElId = function(node) {
  //id=block-a1a1a1a1a1a1a1a1a
  var id = node.getAttribute('id');
  if (!(typeof id === 'string' && id.startsWith('block-'))) {
    return null;
  }

  return id.substring(6);
};

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