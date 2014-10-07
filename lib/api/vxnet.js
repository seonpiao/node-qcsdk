define(function(require, exports, module) {

    var Vxnet = function(options) {
        options = options || {};
        this._id = options.id || [];
    };

    Vxnet.create = function(params, callback) {
        params = qingcloud.extend(params, {
            action: 'CreateVxnets'
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
                    var vxnet = new self.api.Vxnet({
                        id: data.vxnets
                    });
                    if (callback) {
                        callback(null, vxnet);
                    }
                }
            }
        });
    };

    Vxnet.describe = function(params, callback) {
        params = qingcloud.extend(params, {
            action: 'DescribeVxnets'
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
                    data.vxnet_set.forEach(function(item) {
                        ids.push(item.vxnet_id);
                    });
                    if (callback) {
                        callback(null, new self.api.Vxnet({
                            id: ids
                        }));
                    }
                }
            }
        });
    };

    Vxnet.prototype = {
        get count() {
            return this._id.length;
        },
        get id() {
            return this._id;
        },
        describe: function(callback) {
            var params = {
                action: 'DescribeVxnets',
                vxnets: this._id
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
        remove: function(callback) {
            var ids = this._id;
            var params = {
                action: 'DeleteVxnets',
                vxnets: ids
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
        join: function(params, callback) {
            var ids = this._id;
            if (ids.length > 1) {
                callback({
                    ret_code: 1100,
                    message: 'InvailidRequestFormat, Can join only one vxnet once.'
                });
            } else {
                params = qingcloud.extend(params, {
                    action: 'JoinVxnet',
                    vxnet: ids[0]
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
        },
        leave: function(params, callback) {
            var ids = this._id;
            if (ids.length > 1) {
                callback({
                    ret_code: 1100,
                    message: 'InvailidRequestFormat, Can join only one vxnet once.'
                });
            } else {
                params = qingcloud.extend(params, {
                    action: 'LeaveVxnet',
                    vxnet: ids[0]
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
        },
        modifyAttributes: function(params, callback) {
            var ids = this._id;
            if (ids.length > 1) {
                callback({
                    ret_code: 1100,
                    message: 'InvailidRequestFormat, Can modify only one vxnet once.'
                });
            } else {
                params = qingcloud.extend(params, {
                    action: 'ModifyVxnetAttributes',
                    vxnet: ids[0]
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
        },
        describeInstances: function(params, callback) {
            var ids = this._id;
            var self = this;
            if (ids.length > 1) {
                callback({
                    ret_code: 1100,
                    message: 'InvailidRequestFormat, Can describe only one vxnet once.'
                });
            } else {
                params = qingcloud.extend(params, {
                    action: 'DescribeVxnetInstances',
                    vxnet: ids[0]
                });
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
                    },
                    error: function() {
                        console.log()
                    }
                });
            }
        }
    };

    module.exports = Vxnet;
});