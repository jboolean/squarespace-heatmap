/**
 * A stopwatch that stops automatically after a timeout since the last start
 * @method TimeoutStopwatch
 */
var TimeoutStopwatch = function(){
  this._accuredTime = 0;
  this._timeoutId = null;
};

TimeoutStopwatch.TIMEOUT = 5000;

TimeoutStopwatch.prototype = {
  start: function() {
    if (this._timeoutId !== null) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }

    if (!this._running) {
      this._startTime = Date.now();
    }

    this._running = true;
    this._timeoutId = setTimeout(function() {
      this.stop();
    }.bind(this), TimeoutStopwatch.TIMEOUT);
  },

  stop: function() {
    if (!this._running) {
      return;
    }

    this._accuredTime += Date.now() - this._startTime;
    this._running = false;
  },

  getTime: function() {
    var time = this._accuredTime;

    if (this._running) {
      time += Date.now() - this._startTime;
    }

    return time;
  }
};

module.exports = TimeoutStopwatch;