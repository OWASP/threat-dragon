'use strict';

var finish_test = function(done) {
  return function (err) {
    if (err) {
      done.fail(err)
    } else {
      done()
    }
  }
}

module.exports = finish_test;