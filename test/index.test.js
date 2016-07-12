import assert from 'assert';
import path from 'path';
import feathers from 'feathers';
import request from 'request';
import bootstrap from '../src/';

describe('feathers-bootstrap', function() {
  it('is CommonJS compatible', function() {
    assert.equal(typeof require('../lib'), 'function');
  });

  it('bootstraps a basic application', function(done) {
    const app = feathers()
      .configure(bootstrap(path.join(__dirname, 'simple.json')));

    app.bootstrap.then(() =>
      app.service('todos').create({ text: 'test' }).then(todo => {
        assert.ok(typeof todo.id !== 'undefined');
        assert.equal(todo.text, 'test');
        done();
      })
    ).catch(done);
  });

  describe('example application', function() {
    before(function(done) {
      this.app = require('../example/src/app');
      this.app.start().then(server => {
        this.server = server;
        done();
      }).catch(done);
    });

    after(function(done) {
      this.server.close(done);
    });

    it('registered the error handler', function(done) {
      request({
        url: 'http://localhost:3030/notfound',
        json: true
      }, function(err, res, body) {
        if(err) {
          return done(err);
        }

        assert.deepEqual(body, { name: 'NotFound',
          message: 'Page not found',
          code: 404,
          className: 'not-found',
          errors: {}
        });
        done();
      });
    });

    it('initialized the todos service with its hooks', function(done) {
      request({
        url: 'http://localhost:3030/todos/dishes',
        json: true
      }, function(err, res, body) {
        if(err) {
          return done(err);
        }

        assert.deepEqual(body, {
          id: 'dishes?',
          text: 'You really have to do dishes?! (updated from hook)'
        });
        done();
      });
    });
  });
});
