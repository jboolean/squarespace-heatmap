var TimeoutStopwatch = require('./timeoutStopwatch.js');

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

var Tracker = function() {
  this._timers = {};
};

Tracker.prototype = {
  trackHovers: function() {
    document.addEventListener('mousemove', function(e) {
      //TODO: throttle this for sanity
      var trackedEl = getTrackedAncestor(e.target);
      if (!trackedEl) {
        return;
      }

      var elId = getTrackedElId(trackedEl);

      if (!this._timers[elId]) {
        this._timers[elId] = new TimeoutStopwatch();
      }

      this._timers[elId].start();
    }.bind(this));

    document.addEventListener('mouseout', function(e) {
      var el = e.target;
      var elId = getTrackedElId(el);

      if (el && el !== document && el.matches('.sqs-block') && this._timers[elId]) {
        this._timers[elId].stop();
      }
    }.bind(this));
  },

  getHoverScores: function() {
    var scores = {};

    Object.keys(this._timers).forEach(function(elId) {
      scores[elId] = this._timers[elId].getTime();
    }.bind(this));

    return scores;
  }
};

var sendTrackingData = function(tracker) {
  console.log(tracker.getHoverScores());
};

window.addEventListener('DOMContentLoaded',function() {
  //run it
  var pageTracker = new Tracker();
  pageTracker.trackHovers();

  setInterval(function() {
    sendTrackingData(pageTracker);
  }, 5000);
},false);

// module.exports = Tracker;