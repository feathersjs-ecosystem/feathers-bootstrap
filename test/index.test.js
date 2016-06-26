import assert from 'assert';
import app from './app/app';

describe('feathers-bootstrap', () => {
  it('is CommonJS compatible', () => {
    assert.equal(typeof require('../lib'), 'function');
  });

  it('does something', function() {
    assert.ok(app);
  });
});
