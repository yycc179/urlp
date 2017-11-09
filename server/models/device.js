/**
 * Created by yangyang on 2016/7/13.
 */
// const EventProxy = require('eventproxy');
const db = require('./db');
const utils = require("../utils/utils");

const DeviceSchema = db.Schema({
    uniqueId: { type: String, index: true, unique: true },
    clientId: String,
    token: String,
})

const Device = db.model('device', DeviceSchema);

function login(uniqueId, clientId, cbk) {
    Device.findOneAndUpdate(
        { uniqueId },
        { uniqueId, clientId },
        { upsert: true },
        cbk
    )
};

function newClient(clientId, user, cbk) {
    if (clientId.length == 32) {
        var uniqueId = utils.aesDecrypt(clientId);

        if (/\W/.test(uniqueId)) {
            return cbk('clientId invalid');
        }

        let token = utils.genToken(user);
        return Device.create({ uniqueId, clientId, token }, cbk);
    }

    Device.findOneAndUpdate(
        { clientId },
        { token: utils.genToken(user) },
        { new: true },
        (err, device) => {
            if (err) throw err;
            if (!device) {
                return cbk('clientId invalid');
            }
            cbk(null, device)
        });

};

function getToken(uniqueId, clientId, cbk) {
    Device.findOne({ uniqueId, clientId }, (err, device) => {
        if (err) throw err;

        if (!device) {
            return cbk('uniqueId or clientId invalid');
        }

        cbk(null, device.token);
    });
};

function renewToken(uniqueId, user, cbk) {
    let token = utils.genToken(user);
    Device.update(
        { uniqueId },
        { token },
        (err, raw) => {
            if (err) throw err;

            if(!raw.nModified) {
                return cbk('uniqueId invalid');
            }

            cbk(null, token)
        });
};

module.exports = {
    login,
    newClient,
    getToken,
    renewToken,
}

// db.connection.once('open', ()=> {console.time('mg')})
// function defaultCbk(err, data) {
//     if(err) console.error(err);
//     console.timeEnd('mg');
//     console.log(data);
// }
// renewToken('112', {email:'12'}, defaultCbk);
//newClient('22', {email:'asfea'}, defaultCbk)