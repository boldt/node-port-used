/*
 * https://gist.github.com/timoxley/1689041
 */

var isPortTaken = function(port, fn) {
  var net = require('net')
  var tester = net.createServer()
  .once('error', function (err) {
    if (err.code != 'EADDRINUSE') return fn(err)
    fn(null, true)
  })
  .once('listening', function() {
    tester.once('close', function() { fn(null, false) })
    .close()
  })
  .listen(port)
};

var handler = {};


handler.isPortTaken = function(test) {
  return function(req, res, next) {
    isPortTaken(test.port, function(err, bool){
      if(err) {
        console.log('Err:', err);
        return;
      }
      test.result = bool;
      console.log(test.name, 'on port', test.port, bool);
      next();
    })
  }
};

handler.finish = function(tests) {
  return function(req, res, next) {
    for(var i=0; i<tests.length; i++) {
      delete tests[i].port;
    }
    res.status(200).send(tests);
  }
};

module.exports = handler;
