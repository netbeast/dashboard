
var through       = require('through2')
  , setImmediate  = global.setImmediate

setImmediate = setImmediate || function(func) {
  setTimeout(func, 0)
}

module.exports.testStream = function() {
  return through(function(buf, enc, cb) {
    var that = this;
    setImmediate(function() {
      that.push(buf)
      cb();
    });
  });
};
