const { test } = require('node:test');
const assert = require('node:assert');
const { searchWeb } = require('../src/functions.js');

test('searchWeb function fetches results successfully', () => {
  const result = searchWeb('Node.js');
  
  assert.strictEqual(typeof result, 'string');
  assert.ok(result.length > 0, 'Result should not be empty');
  assert.ok(!result.includes('Failed to perform web search.'), 'Should not return failure message');
  assert.ok(
    result.toLowerCase().includes('node'),
    'Result should contain references to Node.js'
  );
});
