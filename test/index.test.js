import assert from 'assert';
import bootstrap from '../src';
import path from 'path';

describe('feathers-bootstrap', () => {
  it('is CommonJS compatible', () => {
    assert.equal(typeof require('../lib'), 'function');
  });

  it.skip('does something', function() {
    bootstrap({
      main: path.join(__dirname, 'feathers.json')
    });
  });
});
