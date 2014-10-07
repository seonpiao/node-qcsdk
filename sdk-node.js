require('seajs');

var request = require('request');
var crypto = require('crypto');
var util = require('./lib/util');
var nodeUtil = require('util');

global.qingcloud = {
    API: require('./lib/api')
};

qingcloud.request = function(options) {
    options.method = options.method.toUpperCase() || 'GET';
    if (options.qs) {
        options.url += '?' + util.serialize(options.qs);
        delete options.qs;
    }
    console.log(JSON.stringify(options))
    request(options, function(err, response, body) {
        if (options.dataType === 'json') {
            body = JSON.parse(body);
        }
        if (options.success) {
            options.success(body);
        }
    });
};

qingcloud.base64 = function(data, secretAccessKey) {
    var hmac = crypto.createHmac('sha256', secretAccessKey);
    hmac.update(data);
    return hmac.digest('base64');
};

qingcloud.qsescape = require('querystring').escape;

qingcloud.extend = require('node.extend');

qingcloud.inherits = nodeUtil.inherits;

qingcloud.EventEmitter = require('events').EventEmitter;

module.exports = qingcloud;