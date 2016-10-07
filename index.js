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

isPortTaken(8080, function(err, bool){
  if(err) {
    console.log('Err:', err);
    return;
  }
  console.log('8080', bool);
})
