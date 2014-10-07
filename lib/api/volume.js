define(function(require, exports, module) {
    // var appendCommonParam = require('./util/appendCommonParam');
    // var config = require('./config');

    var Volume = function(options) {
        options = options || {};
        this._id = options.id || [];
    };

    Volume.create = function(params, callback) {
        params = qingcloud.extend(params, {
            action: 'CreateVolumes'
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
                    var volume = new self.api.Volume({
                        id: data.volumes
                    });
                    if (callback) {
                        callback(null, volume);
                    }
                }
            }
        });
    };

    Volume.describe = function(params, callback) {
        params = qingcloud.extend(params, {
            action: 'DescribeVolumes'
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
                    data.volume_set.forEach(function(item) {
                        ids.push(item.volume_id);
                    });
                    if (callback) {
                        callback(null, new self.api.Volume({
                            id: ids
                        }));
                    }
                }
            }
        });
    };

    Volume.prototype = {
        get count() {
            return this._id.length;
        },
        get id() {
            return this._id;
        },
        describe: function(callback) {
            var params = {
                action: 'DescribeVolumes',
                volumes: this._id
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
                action: 'DeleteVolumes',
                volumes: ids
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
        attach: function(params, callback) {
            var ids = this._id;
            params = qingcloud.extend(params, {
                action: 'AttachVolumes',
                volumes: ids
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
        detach: function(params, callback) {
            var ids = this._id;
            params = qingcloud.extend(params, {
                action: 'DetachVolumes',
                volumes: ids
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
                action: 'ResizeVolumes',
                volumes: ids
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
                    message: 'InvailidRequestFormat, Can modify only one volume once.'
                });
            } else {
                params = qingcloud.extend(params, {
                    action: 'ModifyVolumeAttributes',
                    volume: ids[0]
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

    module.exports = Volume;
});