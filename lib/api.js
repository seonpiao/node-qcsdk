var util = require('./util');

var APIClasses = {
  'Instance': require('./api/instance'),
  'Volume': require('./api/volume'),
  'Vxnet': require('./api/vxnet'),
  'Eip': require('./api/eip')
};

var API = function(options) {
  this.zone = options.zone;
  this.accessKeyId = options.accessKeyId;
  this.secretAccessKey = options.secretAccessKey;

  this._base = 'https://api.qingcloud.com/iaas/'

  var self = this;
  for (var apiName in APIClasses) {
    var APIClass = APIClasses[apiName];
    self[apiName] = (function(APIClass) {
      return function(options) {
        var instance = new APIClass(options);
        qingcloud.EventEmitter.call(instance);
        instance.api = self;
        return instance;
      }
    })(APIClass);
    qingcloud.inherits(self[apiName], qingcloud.EventEmitter);
    self[apiName].api = self;
    for (var prop in APIClass) {
      self[apiName][prop] = APIClass[prop];
    }
  }
};

API.prototype.request = function(options) {
  var UTCDate = new Date();
  UTCDate.setHours(UTCDate.getHours() - 8);
  var commonParams = {
    zone: this.zone,
    time_stamp: (util.dateFormat(UTCDate, 'yyyy-MM-dd') + 'T' + util.dateFormat(UTCDate, 'HH:mm:ss') + 'Z'),
    access_key_id: this.accessKeyId,
    version: '1',
    signature_method: 'HmacSHA256',
    signature_version: '1'
  };
  options.method = options.method ? options.method.toUpperCase() : 'GET';
  options.url = this._base;
  options.json = true;
  if (options.qs) {
    this._convertCamelCaseParamNameToUnderline(options.qs);
    this._parseParams(options.qs);
    options.qs = qingcloud.extend({}, options.qs, commonParams);
    var pathname = options.url.replace(/\?.*$/, '').replace(/\w+:\/\/[^\/]+/, '');
    options.qs.signature = util.sign(options.method, pathname, options.qs, this.secretAccessKey);
    qingcloud.request(options);
  }
};

API.prototype._parseParams = function(params) {
  for (var name in params) {
    if (Array.isArray(params[name])) {
      this._appendArrayParam(params, name, params[name]);
      delete params[name];
    }
  }
};

API.prototype._appendArrayParam = function(params, name, array) {
  array.forEach(function(value, index) {
    params[name + '.' + (index + 1)] = value;
  });
};

API.prototype._camelCaseToUnderline = function(name) {
  return name.replace(/([A-Z])/g, function(matched) {
    return '_' + matched.toLowerCase();
  });
};

API.prototype._convertCamelCaseParamNameToUnderline = function(params) {
  for (var name in params) {
    var parsedName = this._camelCaseToUnderline(name);
    if (parsedName !== name) {
      params[parsedName] = params[name];
      delete params[name];
    }
  }
};

module.exports = API;