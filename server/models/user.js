/**
 * Created by yangyang on 2016/2/18.
 * Update by yangyang 2017/1/3
 */
const db = require('./db');
const sha1 = require('utility').sha1;
const config = require("../config");

const UserShcema = db.Schema({
    email: { type: String, index: true, unique: true },
    password: String,
    name: String,
    photo: String,
    device: Array,
})

const User = db.model('user', UserShcema);

function register(user, cbk) {
    User.findOne({ email: user.email }, (err, _user) => {
        if (err) throw err;

        if (_user) {
            return cbk('User exsit')
        }

        user.password = sha1(config.hash_slat + user.password);

        new User(user).save(cbk)
    })
}

function verify(email, password, cbk) {
    User.findOne({ email })
        .lean()
        .exec((err, user) => {
            if (err) throw err;

            let message = '';
            if (!user) {
                message = 'Username incorect';
            }
            else if (sha1(config.hash_slat + password) != user.password) {
                message = 'Password incorect';
                user = null;
            }
            else {
                delete user.password
            }
            cbk(null, user, { message });
        })
}

function oauthVerify(accessToken, refreshToken, profile, cbk) {
    console.log(accessToken)

    var user = {
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value
    };

    User.findOneAndUpdate(
        { email: user.email },
        user,
        { upsert: true, new: true },
        cbk)
}

function linkDevice(email, uniqueId, cbk) {
    User.findOneAndUpdate(
        { email },
        { $addToSet: { device: uniqueId } },
        { new: true },
        (err, user) => {
            if (err) throw err;
            if (!user) {
                return cbk('User not exists')
            }
            cbk(null, user)
        })
}

// function defaultCbk(err, data) {
//     if (err) console.error(err);
//     console.timeEnd('user');
//     console.log(data);
// }

// let email = 'yy';
// db.connection.once('open', () => { console.time('user') })
// register({email, password:'123456'}, defaultCbk)
// verify('yy', '123456', defaultCbk)
// oauth_login({ email, name: 'yy' }, defaultCbk)
// linkDevice(email, 'FGAA518421922122', defaultCbk);
module.exports = {
    register,
    verify,
    oauthVerify,
    linkDevice,
    models: User,
}
