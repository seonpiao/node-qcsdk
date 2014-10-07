var qingcloud = require('../sdk-node');

var assert = require('assert');

var waitForStatus = function(volume, status, callback) {
  volume.describe(function(err, data) {
    var result = (data.volume_set || data.instance_set).every(function(item) {
      return item.status === status;
    });
    if (result) {
      callback();
    } else {
      setTimeout(function() {
        waitForStatus(volume, status, callback);
      }, 5000);
    }
  });
};

describe('Volume', function() {
  this.timeout(60000);
  var api = new qingcloud.API({
    zone: 'gd1',
    accessKeyId: 'BAEYUYBEMFPDYQMDNHKQ'
  });
  var deleteAll = function(callback) {
    if (createdVolume) {
      createdVolume.remove(function(err) {
        if (!err) {
          if (callback) {
            callback();
          }
        } else {
          setTimeout(deleteAll.bind(null, callback), 5000);
        }
      });
    } else {
      if (callback) {
        callback();
      }
    }
  };
  beforeEach(function(done) {
    done();
  });
  var createdVolume, createdInstance;
  before(function(done) {
    deleteAll(function() {
      api.Instance.create({
        imageId: 'wheezyx64d',
        instanceType: 'c1m1',
        instanceName: 'test_volume',
        loginMode: 'keypair',
        loginKeypair: 'kp-f73qm2fj'
      }, function(err, instance) {
        assert.equal(null, err);
        createdInstance = instance;
        done();
      });
    });
  });
  describe('#Volume.create()', function() {
    it('create a volume', function(done) {
      api.Volume.create({
        size: 10,
        volumeName: 'volume1'
      }, function(err, volume) {
        createdVolume = volume;
        assert.equal(null, err);
        done();
      });
    });
  });
  describe('#Volumes.describe()', function() {
    it('describe a volume', function(done) {
      api.Volume.describe({
        status: 'running'
      }, function(err, volume) {
        assert.equal(null, err);
        done();
      });
    });
  });
  describe('#describe()', function() {
    it('describe', function(done) {
      createdVolume.describe(function(err, data) {
        assert.equal(null, err);
        assert.equal('volume1', data.volume_set[0].volume_name);
        done();
      });
    });
  });
  describe('#attach & detach', function() {
    it('attach', function(done) {
      waitForStatus(createdInstance, 'running', function() {
        createdVolume.attach({
          instance: createdInstance.id[0]
        }, function(err, data) {
          assert.equal(null, err);
          done();
        });
      });
    });
    it('detach', function(done) {
      waitForStatus(createdVolume, 'in-use', function() {
        createdVolume.detach({
          instance: createdInstance.id[0]
        }, function(err, data) {
          assert.equal(null, err);
          done();
        });
      });
    });
  });
  describe('#resize()', function() {
    it('resize volume', function(done) {
      waitForStatus(createdVolume, 'available', function resize() {
        createdVolume.resize({
          size: 50
        }, function(err) {
          if (err && err.ret_code === 1400) {
            setTimeout(resize, 5000);
          } else {
            assert.equal(null, err);
            done();
          }
        })
      });
    });
  });
  describe('#modifyAttributes()', function() {
    it('modify multi volumes attributes', function(done) {
      api.Volume.create({
        size: 10
      }, function(err, newVolume) {
        assert.equal(null, err);
        waitForStatus(newVolume, 'available', function() {
          api.Volume.describe({
            status: 'available'
          }, function(err, volume) {
            volume.modifyAttributes({
              name: 'new name'
            }, function(err) {
              assert.equal(true, volume.count > 1);
              assert.equal(1100, err.ret_code);
              (function remove() {
                newVolume.remove(function(err) {
                  if (err) {
                    setTimeout(remove, 5000);
                  } else {
                    done();
                  }
                })
              })();
            });
          });
        });
      });
    });
    it('modify volume name', function(done) {
      createdVolume.modifyAttributes({
        volumeName: 'new name'
      }, function(err, data) {
        assert.equal(null, err);
        createdVolume.describe(function(err, data) {
          assert.equal('new name', data.volume_set[0].volume_name);
          done();
        })
      });
    });
    it('modify volume description', function(done) {
      createdVolume.modifyAttributes({
        description: 'new description'
      }, function(err, data) {
        assert.equal(null, err);
        createdVolume.describe(function(err, data) {
          assert.equal('new description', data.volume_set[0].description);
          done();
        })
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