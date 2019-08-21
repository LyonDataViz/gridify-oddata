import {fetchJson} from '../src/fetchFile';

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

// fetchJson
//
// Test strategy: fetch promise is not tested with tape, as it's a browser
// functionality.
tape(
  'fetchJson(mockEndpoint, "random/random-data.json") returns the random dataset JSON metadata file',
  async test => {
    const json = await fetchJson(mockEndpoint, 'random/random-data.json').catch(
      failTestOnError(test)
    );
    test.equals(typeof json, 'object', 'returns an object');
    test.equals(
      json.name,
      'Random XY Data',
      'its name property is set to "Random XY Data"'
    );
    test.end();
  }
);

tape(
  'fetchJson(mockEndpoint, "unknownfile.json") throws an exception',
  async test => {
    await test.rejects(
      fetchJson(mockEndpoint, 'unknownfile.json'),
      Error,
      'throw an exception if file is unknown or could not be fetched'
    );
    test.end();
  }
);

tape('fetchJson(1, "dataset.json") throws an exception', async test => {
  await test.rejects(
    fetchJson(1, 'dataset.json'),
    TypeError,
    'throw an exception if endpoint parameter is not a function or a string'
  );
  test.end();
});

tape('fetchJson(mockEndpoint, 1) throws an exception', async test => {
  await test.rejects(
    fetchJson(mockEndpoint, 1),
    TypeError,
    'throw an exception if endpoint parameter is not a function or a string'
  );
  test.end();
});
