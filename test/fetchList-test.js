import {fetchList} from '../src/fetchList';

// Required modules
const syncTape = require('tape');
const promisifyTape = require('tape-promise').default;
const fs = require('fs').promises; // ExperimentalWarning: The fs.promises API is experimental

// Common variables and helpers
const tape = promisifyTape(syncTape);
const mockEndpoint = relativeFile =>
  fs.readFile('test/data/' + relativeFile, 'utf-8').then(d => JSON.parse(d));
const failTestOnError = test => error => {
  test.fail('should not throw any exception, threw ' + error);
  test.end();
};
const index = ['random/random-data.json'];

// fetchList
//
// Test strategy: fetch promise is not tested with tape, as it's a browser
// functionality.
tape(
  'fetchList(mockEndpoint, "dataset.json") returns the fetchList of JSON files',
  async test => {
    const json = await fetchList(mockEndpoint, 'dataset.json').catch(
      failTestOnError(test)
    );
    test.ok(Array.isArray(json), 'returns an array');
    test.equal(json.length, 1, 'of length 1');
    test.deepEqual(
      json,
      index,
      'equal to expected content ["random/random-data.json"]'
    );
    test.end();
  }
);

tape(
  'fetchList(mockEndpoint, "unknownfile.json") throws an exception',
  async test => {
    await test.rejects(
      fetchList(mockEndpoint, 'unknownfile.json'),
      Error,
      'throw an exception if file is unknown or could not be fetched'
    );
    test.end();
  }
);

tape(
  'fetchList(mockEndpoint, "bad-dataset-*.json") throws an exception',
  async test => {
    await test.rejects(
      fetchList(mockEndpoint, 'bad-dataset-not-an-array.json'),
      Error,
      'throw an exception if the JSON is not an array'
    );
    await test.rejects(
      fetchList(mockEndpoint, 'bad-dataset-not-strings.json'),
      Error,
      'throw an exception if the JSON is not an array of strings'
    );
    test.end();
  }
);

tape('fetchList(1, "dataset.json") throws an exception', async test => {
  await test.rejects(
    fetchList(1, 'dataset.json'),
    TypeError,
    'throw an exception if endpoint parameter is not a function or a string'
  );
  test.end();
});

tape('fetchList(mockEndpoint, 1) throws an exception', async test => {
  await test.rejects(
    fetchList(mockEndpoint, 1),
    TypeError,
    'throw an exception if file parameter is not a string'
  );
  test.end();
});
