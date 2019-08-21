import {getAll} from '../src/getAll';

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

// getAll
tape(
  'getAll(mockEndpoint, "dataset.json") returns an array of promises (parsed JSON files)',
  async test => {
    const array = await getAll(mockEndpoint, 'dataset.json').catch(
      failTestOnError(test)
    );
    test.equal(array.length, 1, 'array is length 1');
    test.equal(typeof array[0].then, 'function', 'array elements are promises');
    const random = await array[0];
    test.equal(
      typeof random,
      'object',
      'first array element promise resolves to an object'
    );
    test.equal(
      random.file,
      'random/random-data.csv',
      'this object has its file property set to "random/random-data.csv"'
    );
    test.equal(
      random.name,
      'Random XY Data',
      'this object has its name property set to "Random XY Data"'
    );
    test.end();
  }
);

tape(
  'getAll(mockEndpoint, "unknownfile.json") throws an exception',
  async test => {
    await test.rejects(
      getAll(mockEndpoint, 'unknownfile.json'),
      Error,
      'throw an exception if file is unknown or could not be fetched'
    );
    test.end();
  }
);

tape(
  'getAll(mockEndpoint, "bad-dataset-*.json") throws an exception',
  async test => {
    await test.rejects(
      getAll(mockEndpoint, 'bad-dataset-not-an-array.json'),
      Error,
      'throw an exception if the JSON is not an array'
    );
    await test.rejects(
      getAll(mockEndpoint, 'bad-dataset-not-strings.json'),
      Error,
      'throw an exception if the JSON is not an array of strings'
    );
    test.end();
  }
);

tape('getAll(1, "dataset.json") throws an exception', async test => {
  await test.rejects(
    getAll(1, 'dataset.json'),
    TypeError,
    'throw an exception if endpoint parameter is not a function or a string'
  );
  test.end();
});

tape('getAll(mockEndpoint, 1) throws an exception', async test => {
  await test.rejects(
    getAll(mockEndpoint, 1),
    TypeError,
    'throw an exception if file parameter is not a string'
  );
  test.end();
});
