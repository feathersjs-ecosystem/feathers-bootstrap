import assert from 'assert';
import path from 'path';
import { load, process, default as loadAndProcess } from '../src/loader';

describe('feathers-bootstrap loader', () => {
  it('`load` and processes configuration files recursively', function() {
    const result = load({
      require: './loader/first.json'
    }, __filename);

    assert.equal(result.module.options.test.module.module, 'world');
  });

  it('`load` can require Node builtins', function() {
    const result = load({
      require: 'path'
    }, __filename);

    assert.equal(result.module, require('path'));
  });

  it('`process` simple processing', function(done) {
    process({
      require: 'somewhere.json',
      module: {
        module: function(opts) {
          return `${opts.test} ran`;
        },
        options: { test: 'testing' }
      }
    }).then(data => {
      assert.equal(data, 'testing ran');
      done();
    }).catch(done);
  });

  it('`process` result is extended with additional data', function(done) {
    process({
      require: 'somewhere.json',
      module: {
        module: function(opts) {
          return { result: `${opts.test} ran` };
        },
        options: { test: 'testing' },
        hi: 'there',
        otherOption: { test: true }
      }
    }).then(data => {
      assert.deepEqual(data, {
        result: 'testing ran',
        hi: 'there',
        otherOption: { test: true }
      });
      done();
    }).catch(done);
  });

  it('does not process normal modules', function(done) {
    process({
      module: require('path')
    }).then(path => {
      assert.equal(path, require('path'));
      done();
    });
  });

  it('`process` with promises from functions', function(done) {
    process({
      require: 'somewhere.json',
      module: {
        module: function(options) {
          return new Promise(resolve =>
            setTimeout(() => resolve(`${options.test} ran`), 100)
          );
        },
        options: { test: 'testing' }
      }
    }).then(data => {
      assert.equal(data, 'testing ran');
      done();
    }).catch(done);
  });

  it('`process` simple conversion', function(done) {
    process({
      test: 'thing'
    }, () => 'converted').then(data => {
      assert.equal(data.test, 'converted');
      done();
    }).catch(done);
  });

  it('`process` processes a JSON configuration', function(done) {
    const loaded = load({
      require: './loader/first.json'
    }, __filename);

    process(loaded).then(result => {
      assert.equal(result, path.join('world', 'thing'));
      done();
    }).catch(done);
  });

  it('`default` processes a JSON configuration runs a converter', function(done) {
    const converter = value => value === 'thing' ? 'converted' : value;

    loadAndProcess({
      require: './loader/first.json'
    }, __filename, converter).then(result => {
      assert.equal(result, path.join('world', 'converted'));
      done();
    }).catch(done);
  });
});
