var qingcloud = require('../sdk-node');

var assert = require('assert');

var waitForStatus = function(vxnet, status, callback) {
  vxnet.describe(function(err, data) {
    var result = (data.vxnet_set || data.instance_set).every(function(item) {
      return item.status === status;
    });
    if (result) {
      callback();
    } else {
      setTimeout(function() {
        waitForStatus(vxnet, status, callback);
      }, 5000);
    }
  });
};

describe('Vxnet', function() {
  this.timeout(60000);
  var api = new qingcloud.API({
    zone: 'gd1',
    accessKeyId: 'BAEYUYBEMFPDYQMDNHKQ'
  });
  var deleteAll = function(callback) {
    if (createdVxnet) {
      createdVxnet.remove(function(err) {
        if (!err) {
          callback();
        } else {
          setTimeout(deleteAll.bind(null, callback), 5000);
        }
      });
    } else {
      callback();
    }
  };
  beforeEach(function(done) {
    done();
  });
  var createdVxnet, createdInstance;
  before(function(done) {
    deleteAll(function() {
      api.Instance.create({
        imageId: 'wheezyx64d',
        instanceType: 'c1m1',
        instanceName: 'test_vxnet',
        loginMode: 'keypair',
        loginKeypair: 'kp-f73qm2fj'
      }, function(err, instance) {
        assert.equal(null, err);
        createdInstance = instance;
        done();
      });
    });
  });
  describe('#Vxnet.create()', function() {
    it('create a vxnet', function(done) {
      api.Vxnet.create({
        vxnetType: 1,
        vxnetName: 'vxnet1'
      }, function(err, vxnet) {
        createdVxnet = vxnet;
        assert.equal(null, err);
        done();
      });
    });
  });
  describe('#Vxnet.describe()', function() {
    it('describe a vxnet', function(done) {
      api.Vxnet.describe({
        status: 'running'
      }, function(err, vxnet) {
        assert.equal(null, err);
        done();
      });
    });
  });
  describe('#describe()', function() {
    it('describe', function(done) {
      createdVxnet.describe(function(err, data) {
        assert.equal(null, err);
        assert.equal('vxnet1', data.vxnet_set[0].vxnet_name);
        done();
      });
    });
  });
  describe('#join & leave', function() {
    it('join', function(done) {
      waitForStatus(createdInstance, 'running', function() {
        createdVxnet.join({
          instances: createdInstance.id
        }, function(err, data) {
          assert.equal(null, err);
          done();
        });
      });
    });
    it('leave', function(done) {
      waitForStatus(createdInstance, 'running', function leave() {
        createdVxnet.leave({
          instances: createdInstance.id
        }, function(err, data) {
          if (err && err.ret_code === 1400) {
            setTimeout(leave, 5000);
          } else {
            assert.equal(null, err);
            done();
          }
        });
      });
    });
  });
  describe('#modifyAttributes()', function() {
    it('modify multi vxnets attributes', function(done) {
      api.Vxnet.create({
        vxnetType: 1
      }, function(err, newVxnet) {
        assert.equal(null, err);
        api.Vxnet.describe({}, function(err, vxnet) {
          vxnet.modifyAttributes({
            name: 'new name'
          }, function(err) {
            assert.equal(true, vxnet.count > 1);
            assert.equal(1100, err.ret_code);
            (function remove() {
              newVxnet.remove(function() {
                if (err) {
                  setTimeout(remove, 5000);
                } else {
                  done();
                }
              });
            })()
          });
        });
      });
    });
    it('modify vxnet name', function(done) {
      createdVxnet.modifyAttributes({
        vxnetName: 'new name'
      }, function(err, data) {
        assert.equal(null, err);
        createdVxnet.describe(function(err, data) {
          assert.equal(null, err);
          assert.equal('new name', data.vxnet_set[0].vxnet_name);
          done();
        })
      });
    });
    it('modify vxnet description', function(done) {
      createdVxnet.modifyAttributes({
        description: 'new description'
      }, function(err, data) {
        assert.equal(null, err);
        createdVxnet.describe(function(err, data) {
          assert.equal('new description', data.vxnet_set[0].description);
          done();
        })
      });
    });
  });
  describe('#describeInstances()', function() {
    it('describe instances', function(done) {
      api.Instance.create({
        imageId: 'wheezyx64d',
        instanceType: 'c1m1',
        instanceName: 'test_vxnet',
        loginMode: 'keypair',
        loginKeypair: 'kp-f73qm2fj',
        count: 2
      }, function(err, newinstances) {
        assert.equal(null, err);
        waitForStatus(newinstances, 'running', function() {
          createdVxnet.join({
            instances: newinstances.id
          }, function(err, data) {
            assert.equal(null, err);
            (function check() {
              createdVxnet.describeInstances({}, function(err, instance) {
                assert.equal(null, err);
                if (instance.count === 2) {
                  (function terminate() {
                    newinstances.terminate(function(err) {
                      if (err) {
                        setTimeout(terminate, 5000);
                      } else {
                        done();
                      }
                    });
                  })();
                } else {
                  setTimeout(check, 5000);
                }
              });
            })();
          });
        });
      });
    });
  });
  describe('#delete()', function() {
    it('terminate instances', function(done) {
      deleteAll(function terminate() {
        createdInstance.terminate(function(err, data) {
          if (err) {
            setTimeout(terminate, 5000);
          } else {
            done();
          }
        })
      });
    });
  });
});