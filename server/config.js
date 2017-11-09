/**
 * Created by yangyang on 2016/6/27.
 */
exports = module.exports = {
    base_url: process.env.NODE_ENV === 'production' ? 'https://urlp.herokuapp.com' : 'http://cddev01:3000',
    db_url:'mongodb://yy:yy123456@ds231715.mlab.com:31715/oweb',
    client_id_size: 7,
    session_secret: 'oweb_s',
    session_age: 24*60*60,
    token_age: 60,//24*60*60,
    token_key:'app.get(oweb_s)',
    aes_key:'LPeOY1CeRAlCBrVn',
    hash_slat:'hash(user)',
    next_update: 60,
    next_query: 60,
    valid_time: 3,  //3 hour
}

function Oauth(name, id, secret, path, scope) {
    this.name = name;
    this.clientID = id;
    this.clientSecret = secret;
    this.callbackURL = exports.base_url + path;
    this.scope = scope;
}

if(process.env.NODE_ENV === 'production') {
    exports.oauth_google = new Oauth(
        "google",
        "571590685153-ajq901lqukomakvmq23sqi2fqsm0stas.apps.googleusercontent.com",
        "oODaKtJCEJ9A17gATImsLDbq",
        '/auth/google/callback',
        ['profile', 'email']
    )
    
    exports.oauth_github = new Oauth(
        "github",
        "aa73f845cdd609d9269f",
        "b3917633567d823eef5272fadf8db9c39a8d40ca",
        "/auth/github/callback",
        ['repo', 'email']
    )
} else {
    exports.oauth_google = new Oauth(
        "google",
        "571590685153-ajq901lqukomakvmq23sqi2fqsm0stas.apps.googleusercontent.com",
        "oODaKtJCEJ9A17gATImsLDbq",
        '/auth/google/callback',
        ['profile', 'email']
    )
    
    exports.oauth_github = new Oauth(
        "github",
        "73f559537e78d931b20c",
        "99156be0e093b25fd52313171de983999bdb4bcb",
        "/auth/github/callback",
        ['repo', 'email']
    )   
}
