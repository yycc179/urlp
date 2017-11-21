var express = require('express');
var router = express.Router();

const net = require('net')

const { spawn, execFile } = require('child_process');

// const py = spawn('python', ['server/external/s.py']);

// py.stdout.on('data', (data) => {
//   console.log(`stdout: ${data}`);
// });

// py.stderr.on('data', (data) => {
//   console.log(`stderr: ${data}`);
// });

// py.on('close', (code) => {
//   console.log(`child process exited with code ${code}`);
// });

router.get('/', function (req, res, next) {
  var client = net.createConnection({ port: 3001 }, () => {
    client.write(req.query.s + ' ' + req.query.js)
  });

  client.on('data', data => {
    res.send(data.toString())
    client.destroy();
  });

  client.on('error', data => {
    res.status(501).send(data)
    client.destroy();
  });

})

function handler(res, next) {
  return (function (e, stdout, stderr) {
    if (e) return res.send(e.toString())

    if(stdout) {
      res.send(stdout.toString())
    }
    else if (stderr) {
      res.send(stderr.toString())
    }

  })
}

// router.get('/', function (req, res, next) {
//   execFile('python', ['server/external/s.py', req.query.s, req.query.js], handler(res, next))
// })

router.get('/v', function (req, res, next) {
  execFile('python', ['server/external/v.py', req.query.u], handler(res, next))
})

module.exports = router
