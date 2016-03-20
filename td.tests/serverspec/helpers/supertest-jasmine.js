'use strict';

function finish_test (done) {
  return function (err) {
    if (err) {
      done.fail(err)
    } else {
      done()
    }
  }
}