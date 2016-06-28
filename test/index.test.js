import assert from 'assert';

describe('feathers-bootstrap', () => {
  it('is CommonJS compatible', () => {
    assert.equal(typeof require('../lib'), 'function');
  });
});
