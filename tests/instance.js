var qingcloud = require('../sdk-node');

var assert = require('assert');

var waitForStatus = function(instance, status, callback) {
  instance.describe(function(err, data) {
    var result = data.instance_set.every(function(item) {
      return item.status === status;
    });
    if (result) {
      callback();
    } else {
      setTimeout(function() {
        waitForStatus(instance, status, callback);
      }, 5000);
    }
  });
};

describe('Instance', function() {
  this.timeout(60000);
  var api = new qingcloud.API({
    zone: 'gd1',
    accessKeyId: 'BAEYUYBEMFPDYQMDNHKQ'
  });
  var terminateAll = function(callback) {
    if (createdInstance) {
      createdInstance.terminate(function(err) {
        if (!err) {
          callback();
        } else {
          setTimeout(terminateAll.bind(null, callback), 5000);
        }
      });
    } else {
      callback();
    }
  };
  beforeEach(function(done) {

    done();
  });
  var api, createdInstance;
  before(function(done) {
    terminateAll(done);
  });
  describe('#Instance.create()', function() {
    it('create a instance', function(done) {
      api.Instance.create({
        imageId: 'wheezyx64d',
        instanceType: 'c1m1',
        instanceName: 'test1',
        loginMode: 'keypair',
        loginKeypair: 'kp-f73qm2fj'
      }, function(err, instance) {
        createdInstance = instance;
        assert.equal(null, err);
        done();
      });
    });
  });
  describe('#Instance.describe()', function() {
    it('describe a instance', function(done) {
      api.Instance.describe({
        status: 'running'
      }, function(err, instance) {
        assert.equal(null, err);
        done();
      });
    });
  });
  describe('#describe()', function() {
    it('describe', function(done) {
      createdInstance.describe(function(err, data) {
        assert.equal(null, err);
        assert.equal('test1', data.instance_set[0].instance_name);
        done();
      });
    });
  });
  describe('#start & stop', function() {
    it('stop', function(done) {
      waitForStatus(createdInstance, 'running', function() {
        createdInstance.stop(function(err) {
          assert.equal(null, err);
          done();
        });
      });
    });
    it('start', function(done) {
      waitForStatus(createdInstance, 'stopped', function() {
        createdInstance.start(function(err) {
          assert.equal(null, err);
          done();
        });
      });
    });
    it('force stop', function(done) {
      waitForStatus(createdInstance, 'running', function() {
        createdInstance.stop(function(err) {
          assert.equal(null, err);
          done();
        }, {
          force: 1
        });
      });
    });
    it('start', function(done) {
      waitForStatus(createdInstance, 'stopped', function() {
        createdInstance.start(function(err) {
          assert.equal(null, err);
          done();
        });
      });
    });
    it('restart', function(done) {
      waitForStatus(createdInstance, 'running', function() {
        createdInstance.restart(function(err) {
          assert.equal(null, err);
          done();
        });
      });
    });
  });
  describe('#reset()', function() {
    it('reset instances', function(done) {
      waitForStatus(createdInstance, 'running', function() {
        createdInstance.reset({
          loginMode: 'keypair',
          loginKeypair: 'kp-f73qm2fj'
        }, function(err) {
          assert.equal(null, err);
          done();
        });
      });
    });
  });
  describe('#resize()', function() {
    it('resize instances', function(done) {
      waitForStatus(createdInstance, 'running', function() {
        createdInstance.stop(function(err) {
          waitForStatus(createdInstance, 'stopped', function() {
            createdInstance.resize({
              instanceType: 'c2m2'
            }, function(err, data) {
              assert.equal(null, err);
              done();
            });
          });
        });
      });
    });
    it('resize instances cpu & memory', function(done) {
      waitForStatus(createdInstance, 'stopped', function resize() {
        createdInstance.resize({
          cpu: 4,
          memory: 8192
        }, function(err, data) {
          if (err && err.ret_code === 1400) {
            setTimeout(resize, 5000);
          } else {
            assert.equal(null, err);
            done();
          }
        });
      });
    });
  });
  describe('#modifyAttributes()', function() {
    it('modify multi instances attributes', function(done) {
      waitForStatus(createdInstance, 'running', function() {
        api.Instance.describe({
          status: 'running'
        }, function(err, instance) {
          instance.modifyAttributes({
            name: 'new name'
          }, function(err) {
            assert.equal(true, instance.count > 1);
            assert.equal(1100, err.ret_code);
            done();
          });
        });
      });
    });
    it('modify instances name', function(done) {
      createdInstance.modifyAttributes({
        instanceName: 'new name'
      }, function(err, data) {
        assert.equal(null, err);
        createdInstance.describe(function(err, data) {
          assert.equal('new name', data.instance_set[0].instance_name);
          done();
        })
      });
    });
    it('modify instances description', function(done) {
      createdInstance.modifyAttributes({
        description: 'new description'
      }, function(err, data) {
        assert.equal(null, err);
        createdInstance.describe(function(err, data) {
          assert.equal('new description', data.instance_set[0].description);
          done();
        })
      });
    });
  });
  describe('#terminate()', function() {
    it('terminate instances', function(done) {
      terminateAll(done);
    });
  });
});