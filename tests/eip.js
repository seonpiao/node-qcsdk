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

describe('Eip', function() {
  this.timeout(60000);
  var api = new qingcloud.API({
    zone: 'pek2',
    accessKeyId: 'UKPJKCXFKLAREBXERMGH',
    secretAccessKey: '60UH0mUY8Jpr8C3wYlR5rwrABSb5AVbCKcae08tx'
  });
  // var deleteAll = function(callback) {
  //   if (createdEip) {
  //     createdEip.remove(function(err) {
  //       if (!err) {
  //         callback();
  //       } else {
  //         setTimeout(deleteAll.bind(null, callback), 5000);
  //       }
  //     });
  //   } else {
  //     callback();
  //   }
  // };
  // beforeEach(function(done) {
  //   done();
  // });
  // var createdEip, createdInstance;
  // before(function(done) {
  //   deleteAll(function() {
  //     api.Instance.create({
  //       imageId: 'wheezyx64d',
  //       instanceType: 'c1m1',
  //       instanceName: 'test_vxnet',
  //       loginMode: 'keypair',
  //       loginKeypair: 'kp-f73qm2fj'
  //     }, function(err, instance) {
  //       assert.equal(null, err);
  //       createdInstance = instance;
  //       done();
  //     });
  //   });
  // });
  // describe('#Eip.create()', function() {
  //   it('create a vxnet', function(done) {
  //     api.Eip.create({
  //       vxnetType: 1,
  //       vxnetName: 'vxnet1'
  //     }, function(err, vxnet) {
  //       createdEip = vxnet;
  //       assert.equal(null, err);
  //       done();
  //     });
  //   });
  // });
  // describe('#Eip.describe()', function() {
  //   it('describe a vxnet', function(done) {
  //     api.Eip.describe({
  //       status: 'running'
  //     }, function(err, vxnet) {
  //       assert.equal(null, err);
  //       done();
  //     });
  //   });
  // });
  // describe('#describe()', function() {
  //   it('describe', function(done) {
  //     createdEip.describe(function(err, data) {
  //       assert.equal(null, err);
  //       assert.equal('vxnet1', data.vxnet_set[0].vxnet_name);
  //       done();
  //     });
  //   });
  // });
  describe('#change bandwidth', function() {
    it('join', function(done) {
      var eip = new api.Eip({
        id: ['eip-wjp2l6kp']
      });
      eip.changeBandwidth({
        bandwidth: 6
      }, function(err) {
        assert.equal(null, err);
        done();
      });
    });
  });
  // describe('#modifyAttributes()', function() {
  //   it('modify multi vxnets attributes', function(done) {
  //     api.Eip.create({
  //       vxnetType: 1
  //     }, function(err, newEip) {
  //       assert.equal(null, err);
  //       api.Eip.describe({}, function(err, vxnet) {
  //         vxnet.modifyAttributes({
  //           name: 'new name'
  //         }, function(err) {
  //           assert.equal(true, vxnet.count > 1);
  //           assert.equal(1100, err.ret_code);
  //           (function remove() {
  //             newEip.remove(function() {
  //               if (err) {
  //                 setTimeout(remove, 5000);
  //               } else {
  //                 done();
  //               }
  //             });
  //           })()
  //         });
  //       });
  //     });
  //   });
  //   it('modify vxnet name', function(done) {
  //     createdEip.modifyAttributes({
  //       vxnetName: 'new name'
  //     }, function(err, data) {
  //       assert.equal(null, err);
  //       createdEip.describe(function(err, data) {
  //         assert.equal(null, err);
  //         assert.equal('new name', data.vxnet_set[0].vxnet_name);
  //         done();
  //       })
  //     });
  //   });
  //   it('modify vxnet description', function(done) {
  //     createdEip.modifyAttributes({
  //       description: 'new description'
  //     }, function(err, data) {
  //       assert.equal(null, err);
  //       createdEip.describe(function(err, data) {
  //         assert.equal('new description', data.vxnet_set[0].description);
  //         done();
  //       })
  //     });
  //   });
  // });
});