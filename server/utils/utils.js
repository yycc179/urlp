/**
 * Created by yangyang on 2016/6/27.
 */
const jwt = require('jsonwebtoken')
    , randomString = require('utility').randomString
    , crypto = require('crypto')
    , config = require("../config");

//function randomstring(size) {
//    size = size || config.client_id_size;
//    var code_string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//    var max_num = code_string.length + 1;
//    var string = '';
//    while (size > 0) {
//        string += code_string.charAt(Math.floor(Math.random() * max_num));
//        size--;
//    }
//    return string;
//};

function getClient(unqi) {
    var clientId = randomString(config.client_id_size);
    return {url: config.base_url + '/auth/' + clientId, clientId: clientId};
};

function genToken(user) {
    return jwt.sign(user, config.token_key, {algorithm: 'HS512', expiresIn: config.token_age})
};

function getToken(req) {
    var part = req.headers.authorization.split(' ');
    return part.length == 2 && /^Bearer$/i.test(part[0]) && part[1];
}

function decodeToken(req) {
    try {
        return jwt.decode(getToken(req));
    }
    catch (err) {
        return undefined;
    }

};

function verifyToken(req, res, next) {
    jwt.verify(getToken(req), config.token_key, (err, decode) => {
        if(!err) {
            req.user = decode;
            return next();
        }
        res.status(err.name == 'TokenExpiredError' ? 498 : 401).json(err)
    })    
}

/**
 * aes加密
 * @param data
 * @param secretKey
 */
 function aesEncrypt(data) {
//    var cipher = crypto.createCipher('aes-128-ecb',secretKey);
//    return cipher.update(data,'utf8','hex') + cipher.final('hex');
    var cipher = crypto.createCipheriv('aes-128-ecb', config.aes_key, '');
    return cipher.update(data,'ascii','hex');
}

/**
 * aes解密
 * @param data
 * @param secretKey
 * @returns {*}
 */
function aesDecrypt(data) {
    var decipher  = crypto.createDecipheriv('aes-128-ecb',config.aes_key, '');
//    var cipherChunks = [0xb9,0x00,0xcc,0xd2,0x93,0x14,0x39,0xda,0x7c,0x0f,0x95,0x18,0x34,0x00,0xb8,0x2c];
    var cipherChunks = [];
    var plainChunks = [];
    cipherChunks.push(data);
    cipherChunks.push(crypto.createCipheriv('aes-128-ecb', secretKey, '').final('hex'));

    for (var i = 0;i < cipherChunks.length;i++) {
        plainChunks.push(decipher.update(cipherChunks[i], 'hex', 'ascii'));
    }
    return plainChunks.join('')
}
module.exports = {
    getClient,
    genToken,
    verifyToken,
    aesEncrypt,
    aesDecrypt,
}