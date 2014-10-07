define(function(require, exports, module) {

    var Eip = function(options) {
        options = options || {};
        this._id = options.id || [];
    };

    Eip.create = function(params, callback) {
        params = qingcloud.extend(params, {
            action: 'AllocateEips'
        });
        var self = this;
        this.api.request({
            qs: params,
            success: function(data) {
                if (data.ret_code !== 0) {
                    if (callback) {
                        callback(data);
                    }
                } else {
                    var eip = new self.api.Eip({
                        id: data.eips
                    });
                    if (callback) {
                        callback(null, eip);
                    }
                }
            }
        });
    };

    Eip.describe = function(params, callback) {
        params = qingcloud.extend(params, {
            action: 'DescribeEips'
        });
        var self = this;
        this.api.request({
            qs: params,
            success: function(data) {
                if (data.ret_code !== 0) {
                    if (callback) {
                        callback(data);
                    }
                } else {
                    var ids = [];
                    data.eip_set.forEach(function(item) {
                        ids.push(item.eip_id);
                    });
                    if (callback) {
                        callback(null, new self.api.Eip({
                            id: ids
                        }));
                    }
                }
            }
        });
    };

    Eip.prototype = {
        get count() {
            return this._id.length;
        },
        get id() {
            return this._id;
        },
        describe: function(callback) {
            var params = {
                action: 'DescribeEips',
                eips: this._id
            };
            this.api.request({
                qs: params,
                success: function(data) {
                    if (data.ret_code !== 0) {
                        if (callback) {
                            callback(data);
                        }
                    } else {
                        if (callback) {
                            callback(null, data);
                        }
                    }
                }
            });
        },
        release: function(callback) {
            var ids = this._id;
            var params = {
                action: 'ReleaseEips',
                eips: ids
            };
            this.api.request({
                qs: params,
                success: function(data) {
                    console.log(data);
                    if (data.ret_code !== 0) {
                        if (callback) {
                            callback(data);
                        }
                    } else {
                        if (callback) {
                            callback(null, data);
                        }
                    }
                }
            });
        },
        changeBandwidth: function(params, callback) {
            var ids = this._id;

            params = qingcloud.extend(params, {
                action: 'ChangeEipsBandwidth',
                eips: ids
            });
            this.api.request({
                qs: params,
                success: function(data) {
                    if (data.ret_code !== 0) {
                        if (callback) {
                            callback(data);
                        }
                    } else {
                        if (callback) {
                            callback(null, data);
                        }
                    }
                }
            });
        },
        modifyAttributes: function(params, callback) {
            var ids = this._id;
            if (ids.length > 1) {
                callback({
                    ret_code: 1100,
                    message: 'InvailidRequestFormat, Can modify only one eip once.'
                });
            } else {
                params = qingcloud.extend(params, {
                    action: 'ModifyEipAttributes',
                    eip: ids[0]
                });
                this.api.request({
                    qs: params,
                    success: function(data) {
                        if (data.ret_code !== 0) {
                            if (callback) {
                                callback(data);
                            }
                        } else {
                            if (callback) {
                                callback(null, data);
                            }
                        }
                    }
                });
            }
        }
    };

    module.exports = Eip;
});