/**
 * Created by yangyang on 2016/6/27.
 */
const router = require('express').Router()
    , passport = require('passport')
    , LocalStrategy = require('passport-local')
    // , BearerStrategy = require('passport-http-bearer')    
    , GithubStrategy = require('passport-github')
    , GoogleStrategy = require('passport-google-oauth20')
    , User = require('../models/user')
    , Device = require('../models/device')
    , utils = require('../utils/utils')
    , jwt = require('jsonwebtoken')
    , config = require('../config');


// router.use(passport.initialize());
// router.use(passport.session());

passport.use(new LocalStrategy({usernameField: 'email'}, User.verify));
passport.use(new GithubStrategy(config.oauth_github, User.oauthVerify));
passport.use(new GoogleStrategy(config.oauth_google, User.oauthVerify));

// passport.use(new BearerStrategy(
//     function(token, done) {
//         done(null, false)
//     }
// ));


function afterUserVerify(name, clientId, req, res, next) {
    passport.authenticate(name, (err, user, info) => {
        function errorHandle(err) {
            return res.json({err});
        }

        function successHandle(user) {
            var token = utils.genToken(user)
            if (name === 'local') {
                res.json({user, token})
            }else {
                res.redirect('/#/profile?s=' + token)
            }
        }

        if (err) {
            return errorHandle(err)
        }
    
        if (!user) {
            return errorHandle(info.message);    
        }

        if(!clientId || clientId == 0) {
            return successHandle(user);
        }
        
        Device.newClient(clientId, {id:user._id, email:user.email}, (err, device) => {
            if (err) {
                return errorHandle(err);
            }
            User.linkDevice(user.email, device.uniqueId, (err, user) => {
                if(err) {
                    return errorHandle(err);
                }
                successHandle(user);
            })
        });
    })(req, res, next);
}

router.post('/signup', (req, res, next) => {
    const {email, password} = req.body
    // const clientId = req.params.client;
    User.register({email, password}, err => {
        if(err) {
            res.json({err})
        } else {
            res.end();
        }
    })
});

router.post('/login', (req, res, next) => {
    afterUserVerify('local', req.query.client, req, res, next);
});

router.get('/profile', utils.verifyToken, (req, res, next) => {
    res.json(req.user)
});

router.get('/renew', (req, res, next) => {
    const {email} = jwt.decode(req.query.token)
    res.json({token: utils.genToken({email})})
});

/**
 * *****************************************************
 */
router.get('/oauth/github', function (req, res, next) {
    passport.authenticate(config.oauth_github.name, 
        {scope: config.oauth_github.scope, 
        state: req.query.client})(req, res, next);
});

router.get('/oauth/google', function (req, res, next) {
    passport.authenticate(config.oauth_google.name, 
        {scope: config.oauth_google.scope, 
        state: req.query.client})(req, res, next);
});

router.get("/github/callback", (req, res, next) => {
    afterUserVerify(config.oauth_github.name, 
        req.query.state, req, res, next);
});

router.get("/google/callback", (req, res, next) => {
    afterUserVerify(config.oauth_google.name, 
        req.query.state, req, res, next);
});

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.models.findById(id, (err, user) => {
        done(null, user);
    })
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    }
    else {
        res.redirect('/auth')
    }
}

router.get('/profile/info', isAuthenticated, (req, res) => {
    res.render('profile', { title: 'profile' , user:req.user});
});

router.get('/profile/logout', (req, res) => {
   req.logout()
   res.redirect('/')
});

module.exports = router