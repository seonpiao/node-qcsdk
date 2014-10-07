module.exports = {
  /**
   * 签名方法
   * @return {[type]} [description]
   */
  sign: function(method, pathname, param, secretAccessKey) {
    var keys = Object.keys(param);
    keys.sort();
    var signedParam = {};
    keys.forEach(function(key) {
      signedParam[key] = encodeURIComponent(param[key]);
    });
    for (var key in param) {
      delete param[key];
    }
    for (var key in signedParam) {
      param[key] = signedParam[key];
    }
    var serializedParam = this.serialize(signedParam);
    var signedString = method.toUpperCase() + '\n' + pathname + '\n' + serializedParam;
    return qingcloud.qsescape(qingcloud.base64(signedString, secretAccessKey));
  },
  /**
   * serialize object to query string
   * @param  {[type]} obj [description]
   * @return {[type]}     [description]
   */
  serialize: function(obj) {
    var params = [];
    for (var key in obj) {
      params.push(key + '=' + obj[key]);
    }
    return params.join('&');
  },
  pad: function(number, length) {
    var pre = "",
      negative = (number < 0),
      string = String(Math.abs(number));

    if (string.length < length) {
      pre = (new Array(length - string.length + 1)).join('0');
    }
    return (negative ? "-" : "") + pre + string;
  },
  dateFormat: function(date, pattern) {
    if ('string' != typeof pattern) {
      return date.toString();
    }

    function replacer(patternPart, result) {
      pattern = pattern.replace(patternPart, result);
    }

    var year = date.getFullYear(),
      month = date.getMonth() + 1,
      date2 = date.getDate(),
      hours = date.getHours(),
      minutes = date.getMinutes(),
      seconds = date.getSeconds();

    replacer(/yyyy/g, this.pad(year, 4));
    replacer(/yy/g, this.pad(parseInt(year.toString().slice(2), 10), 2));
    replacer(/MM/g, this.pad(month, 2));
    replacer(/M/g, month);
    replacer(/dd/g, this.pad(date2, 2));
    replacer(/d/g, date2);

    replacer(/HH/g, this.pad(hours, 2));
    replacer(/H/g, hours);
    replacer(/hh/g, this.pad(hours % 12, 2));
    replacer(/h/g, hours % 12);
    replacer(/mm/g, this.pad(minutes, 2));
    replacer(/m/g, minutes);
    replacer(/ss/g, this.pad(seconds, 2));
    replacer(/s/g, seconds);

    return pattern;
  }
};