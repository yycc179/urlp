const router = require('express').Router(),
  os = require('os'),
  exec = require('child_process').execSync,
  env = process.env;

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
