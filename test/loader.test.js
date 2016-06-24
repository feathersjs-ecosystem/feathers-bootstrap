import assert from 'assert';
import { load, process, default as loadAndProcess } from '../src/loader';

describe('feathers-bootstrap loader', () => {
  it('`load` and processes configuration files recursively', function() {
    const result = load({
      require: './loader/first.json'
    }, __filename);

    assert.equal(result.module.options.test.module.module, 'world');
  });

  it('`process` simple processing', function(done) {
    process({
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

  it('`process` with promises from functions', function(done) {
    process({
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
      assert.equal(result, 'world thing');
      done();
    }).catch(done);
  });

  it('`default` processes a JSON configuration runs a converter', function(done) {
    const converter = value => value === 'thing' ? 'converted' : value;

    loadAndProcess({
      require: './loader/first.json'
    }, __filename, converter).then(result => {
      assert.equal(result, 'world converted');
      done();
    }).catch(done);
  });
});
