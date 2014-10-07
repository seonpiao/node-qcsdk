define(function(require, exports, module) {
    // var appendCommonParam = require('./util/appendCommonParam');
    // var config = require('./config');

    var Instance = function(options) {
        options = options || {};
        this._id = options.id || [];
    };

    Instance.create = function(params, callback) {
        params = qingcloud.extend(params, {
            action: 'RunInstances'
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
                    var instance = new self.api.Instance({
                        id: data.instances
                    });
                    if (callback) {
                        callback(null, instance);
                    }
                }
            }
        });
    };

    Instance.describe = function(params, callback) {
        params = qingcloud.extend(params, {
            action: 'DescribeInstances'
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
                    data.instance_set.forEach(function(item) {
                        ids.push(item.instance_id);
                    });
                    if (callback) {
                        callback(null, new self.api.Instance({
                            id: ids
                        }));
                    }
                }
            }
        });
    };

    Instance.prototype = {
        get count() {
            return this._id.length;
        },
        get id() {
            return this._id;
        },
        describe: function(callback) {
            var params = {
                action: 'DescribeInstances',
                instances: this._id
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
        terminate: function(callback) {
            var ids = this._id;
            var params = {
                action: 'TerminateInstances',
                instances: ids
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
        stop: function(callback, options) {
            var ids = this._id;
            var params = {
                action: 'StopInstances',
                instances: ids
            };
            if (options && options.force) {
                params.force = options.force;
            }
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
        start: function(callback) {
            var ids = this._id;
            var params = {
                action: 'StartInstances',
                instances: ids
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
        restart: function(callback) {
            var ids = this._id;
            var params = {
                action: 'RestartInstances',
                instances: ids
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
        reset: function(params, callback) {
            var ids = this._id;
            params = qingcloud.extend(params, {
                action: 'ResetInstances',
                instances: ids,
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
        resize: function(params, callback) {
            var ids = this._id;
            params = qingcloud.extend(params, {
                action: 'ResizeInstances',
                instances: ids
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
                    message: 'InvailidRequestFormat, Can modify only one instance once.'
                });
            } else {
                params = qingcloud.extend(params, {
                    action: 'ModifyInstanceAttributes',
                    instance: ids[0]
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

    module.exports = Instance;
});