const router = require('express').Router(),
  os = require('os'),
  exec = require('child_process').execSync,
  env = process.env;

const { execFile } = require('child_process');

router.get('/v', function (req, res, next) {
  execFile('python', ['server/external/v.py', req.query.u], (e, stdout, stderr) => {
      if (stdout) {
        res.send(stdout.toString())
      }
      else if (e) {
        return res.send(e.toString())
      }
      else if (stderr) {
        res.send(stderr.toString())
      }
  })
})

router.get('/sys', function (req, res, next) {
  res.json([{
    name: 'Node.js Version',
    value: process.version.replace('v', '')
  }, {
    name: 'NPM Version',
    value: exec('npm --version').toString().replace(os.EOL, '')
  }, {
    name: 'OS Type',
    value: os.type()
  }, {
    name: 'OS Platform',
    value: os.platform()
  }, {
    name: 'OS Architecture',
    value: os.arch()
  }, {
    name: 'OS Release',
    value: os.release()
  }, {
    name: 'CPU Cores',
    value: os.cpus().length
  }, {
    name: 'Lode average',
    value: os.loadavg()
  }, {
    name: 'Memory',
    value: `${parseInt(os.freemem() / (1 << 20))}/${parseInt(os.totalmem() / (1 << 20))} MB`
  }, {
    name: 'NODE_ENV',
    value: env.NODE_ENV
  }])
})

module.exports = router
