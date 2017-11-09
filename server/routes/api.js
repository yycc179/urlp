/**
 * Created by yangyang on 2016/6/27.
 */
const router = require('express').Router()
    , qr = require('qr-image')
    , utils = require("../utils/utils")
    , Device = require('../models/device');


router.post('/auth-url', (req, res, next) => {
    let uniqueId = req.body.uniqueId;
    let client = utils.getClient(uniqueId);

    Device.login(uniqueId, client.clientId, err => {
        if (!err) {
            res.json(client);
        }
        else {
            res.status(404).json({error: 'Not Found: \"Device\"'})
        }
    });

});

router.post('/auth-url/qr', (req, res, next) => {
    var client = utils.getClient(req.body.uniqueId);
    try {
        var img = qr.image(client.url);
        res.writeHead(200, {'Content-Type': 'image/png'});
        img.pipe(res);
    } catch (e) {
        res.status(404).json({err: e});
    }
});

router.get('/claim/:uniqueId/:clientId', (req, res, next) => {
    Device.getToken(req.params.uniqueId, 
        req.params.clientId, 
        (error, token) => {
            if(!token) {
                error = 'not login';
            }

            if(error) {
                return res.status(403).json({error})
            }

            res.json({token})
    })
});

router.get('/jwt/renew/:uniqueId', (req, res, next) => {
    var user = utils.decodeToken(req);
    if(!user) {
        res.status(403).json({message: 'invalid token'})
    }

    Device.renewToken(req.params.uniqueId, user, 
        (err, token) => {
            if (err) {
                res.status(403).json({message: err})
            }
            else {
                res.json({token});
            }
    })
});

router.get('/test_token', utils.verifyToken,
  function(req, res) {
    res.json(req.user);
  });

router.get('/deactivate/:uniqueId', utils.verifyToken, (req, res, next) => {
    res.json({success: true});
});

module.exports = router;