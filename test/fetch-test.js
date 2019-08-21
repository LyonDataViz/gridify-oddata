// Required modules
const syncTape = require('tape');
const promisifyTape = require('tape-promise').default;
// ExperimentalWarning: The fs.promises API is experimental
const fs = require('fs').promises;
// the following works only after rollup has been run on this package
const oddata = require('../');

// Common variables and helpers
const tape = promisifyTape(syncTape);
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

// fetchAllFromEndpoint
//
// Test strategy: fetch promise is not tested with tape, as it's a browser
// functionality.
tape(
  'fetchAllFromEndpoint(mockEndpoint, "dataset.json") returns the list of JSON files',
  async test => {
    const json = await oddata
      .fetchAllFromEndpoint(mockEndpoint, 'dataset.json')
      .catch(failTestOnError(test));
    test.deepEqual(json, index);
    test.end();
  }
);

tape(
  'fetchAllFromEndpoint(mockEndpoint, "unknownfile.json") throws an exception',
  async test => {
    await test.rejects(
      oddata.fetchAllFromEndpoint(mockEndpoint, 'unknownfile.json'),
      Error,
      'throw an exception if file is unknown or could not be fetched'
    );
    test.end();
  }
);

tape(
  'fetchAllFromEndpoint(mockEndpoint, "bad-dataset-*.json") throws an exception',
  async test => {
    await test.rejects(
      oddata.fetchAllFromEndpoint(
        mockEndpoint,
        'bad-dataset-not-an-array.json'
      ),
      Error,
      'throw an exception if the JSON is not an array'
    );
    await test.rejects(
      oddata.fetchAllFromEndpoint(mockEndpoint, 'bad-dataset-not-strings.json'),
      Error,
      'throw an exception if the JSON is not an array of strings'
    );
    test.end();
  }
);

tape(
  'fetchAllFromEndpoint(1, "dataset.json") throws an exception',
  async test => {
    await test.rejects(
      oddata.fetchAllFromEndpoint(1, 'dataset.json'),
      TypeError,
      'throw an exception if endpoint parameter is not a function or a string'
    );
    test.end();
  }
);

tape(
  'fetchAllFromEndpoint(mockEndpoint, 1) throws an exception',
  async test => {
    await test.rejects(
      oddata.fetchAllFromEndpoint(mockEndpoint, 1),
      TypeError,
      'throw an exception if file parameter is not a string'
    );
    test.end();
  }
);

// fetchFromEndpoint
//
// Test strategy: fetch promise is not tested with tape, as it's a browser
// functionality.
tape(
  'fetchFromEndpoint(mockEndpoint, "random/random-data.json") returns the random dataset JSON metadata file',
  async test => {
    const json = await oddata
      .fetchFromEndpoint(mockEndpoint, 'random/random-data.json')
      .catch(failTestOnError(test));
    test.equals(json.name, 'Random XY Data');
    test.end();
  }
);

tape(
  'fetchFromEndpoint(mockEndpoint, "unknownfile.json") throws an exception',
  async test => {
    await test.rejects(
      oddata.fetchFromEndpoint(mockEndpoint, 'unknownfile.json'),
      Error,
      'throw an exception if file is unknown or could not be fetched'
    );
    test.end();
  }
);

tape('fetchFromEndpoint(1, "dataset.json") throws an exception', async test => {
  await test.rejects(
    oddata.fetchFromEndpoint(1, 'dataset.json'),
    TypeError,
    'throw an exception if endpoint parameter is not a function or a string'
  );
  test.end();
});

tape('fetchFromEndpoint(mockEndpoint, 1) throws an exception', async test => {
  await test.rejects(
    oddata.fetchFromEndpoint(mockEndpoint, 1),
    TypeError,
    'throw an exception if endpoint parameter is not a function or a string'
  );
  test.end();
});