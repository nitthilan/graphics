/*jslint node: true, es5: true, nomen: true, unparam: true */

'use strict';

var encode = require('client-sessions').util.encode,
    decode = require('client-sessions').util.decode,
    cookie = require('cookie'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');

// http://stackoverflow.com/questions/18475543/how-access-session-data-of-node-client-sessions-on-socket-io
module.exports = function websocket(io, config) {
    io.set('authorization', function (handshakeData, callback) {
        var session_data;
        if (!handshakeData.headers.cookie) {
            callback({
                status: 'forbidden',
                reason: 'no session',
                source: 'socket_io'
            }, false);
            return;
        }
        var decoded_cookie = decode(config.cookieSetting, cookie.parse(handshakeData.headers.cookie).session);
        if(!decoded_cookie){
            callback({
                status: 'forbidden',
                reason: 'no session',
                source: 'socket_io'
            }, false);
            return;
        }
        session_data = decoded_cookie.content;
        User.findById(session_data.user, function (err, user) {
            if (!err) {
                if (user && user) {
                    handshakeData.session_data = session_data;
                    return callback(null, true);
                } else {
                    return callback(null, false);
                }
            } else {
                return callback(null, false);
            }
        });
        return;
    });
    //io.set('transports', ['websocket', 'flashsocket']);
};