// Required modules
const noPromiseTape = require('tape');
const promisifyTape = require('tape-promise').default;
// ExperimentalWarning: The fs.promises API is experimental
const fs = require('fs').promises;
// the following works only after rollup has been run on this package
const oddata = require('../');

// Common variables and helpers
const tape = promisifyTape(noPromiseTape);
const mockEndpoint = relativeFile =>
  fs.readFile('test/data/' + relativeFile, 'utf-8').then(d => JSON.parse(d));
const failTestOnError = test => error => {
  test.fail('should not throw any exception, threw ' + error);
  test.end();
};
const index = ['random/random-data.json'];

// Ensure that promises and async are supported
// (from https://www.npmjs.com/package/tape-promise)
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}
tape('ensure promises works', test => {
  return delay(100).then(() => test.true(true));
});
tape('ensure async works', async test => {
  await delay(100);
  test.true(true);
  test.end();
});

// fetchAll
//
// Test strategy: fetch promise is not tested with tape, as it's a browser
// functionality.
tape(
  'fetchAll(mockEndpoint, "dataset.json") returns the list of JSON files',
  async test => {
    const json = await oddata
      .fetchAll(mockEndpoint, 'dataset.json')
      .catch(failTestOnError(test));
    test.deepEqual(json, index);
    test.end();
  }
);

tape(
  'fetchAll(mockEndpoint) uses "dataset.json" as second argument by default',
  async test => {
    const json = await oddata
      .fetchAll(mockEndpoint)
      .catch(failTestOnError(test));
    test.deepEqual(json, index);
    test.end();
  }
);

tape(
  'fetchAll(mockEndpoint, "unknownfile.json") throws an exception',
  async test => {
    await test.rejects(
      oddata.fetchAll(mockEndpoint, 'unknownfile.json'),
      Error,
      'throw an exception if relativeFile is unknown or could not be fetched'
    );
    test.end();
  }
);

tape(
  'fetchAll(mockEndpoint, "bad-dataset-*.json") throws an exception',
  async test => {
    await test.rejects(
      oddata.fetchAll(mockEndpoint, 'bad-dataset-not-an-array.json'),
      Error,
      'throw an exception if the JSON is not an array'
    );
    await test.rejects(
      oddata.fetchAll(mockEndpoint, 'bad-dataset-not-strings.json'),
      Error,
      'throw an exception if the JSON is not an array of strings'
    );
    test.end();
  }
);

tape('fetchAll(1) throws an exception', async test => {
  await test.rejects(
    oddata.fetchAll(1),
    TypeError,
    'throw an exception if endpoint parameter is not a function or a string'
  );
  test.end();
});

tape('fetchAll(mockEndpoint, 1) throws an exception', async test => {
  await test.rejects(
    oddata.fetchAll(mockEndpoint, 1),
    TypeError,
    'throw an exception if indexFile parameter is not a string'
  );
  test.end();
});
