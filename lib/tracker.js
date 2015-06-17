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
  },

  resetHoverScores: function() {
    this._timers = {};
  }
};

module.exports = Tracker;