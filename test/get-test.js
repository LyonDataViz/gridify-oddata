import {get} from '../src/get';

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

// get
tape(
  'get(mockEndpoint, "dataset.json") returns an array of parsed objects',
  async test => {
    const array = await get(mockEndpoint, 'dataset.json').catch(
      failTestOnError(test)
    );
    test.equal(array.length, 1, 'array is length 1');
    test.equal(typeof array[0], 'object', 'array elements are objects');
    const random = array[0];
    test.equal(typeof random, 'object', 'first array element is an object');
    test.equal(random.title, 'Random XY Data', `the title is "Random XY Data"`);
    test.ok('raw' in random, `it contains a key named 'raw'`);
    const raw = random.raw;
    test.equal(raw.Title, 'Random XY Data', `the title is "Random XY Data"`);
    test.equal(
      raw.CSV,
      'random/random-data.csv',
      `the CSV file is "random/random-data.csv"`
    );
    test.equal(raw.Separator, ',', `the separator is ","`);
    test.equal(
      raw.Item,
      'Random_XY_Data',
      `the computed item is "Random_XY_Data"`
    );
    test.equal(
      raw.author,
      'Romain Vuillemot',
      'the author is "Romain Vuillemot"'
    );
    test.equal(
      raw.description,
      'Random data',
      'the description is "Random data"'
    );
    test.notOk('source' in raw, 'the source is not present');
    test.deepEqual(
      raw.meta,
      {
        date: 'start_time',
        group: 'group',
        timeParse: '%c',
        cumul: 'distance',
      },
      'the meta is an object with four key/value pairs'
    );
    test.deepEqual(
      raw.attributes[0],
      {
        name: 'x1',
        type: 'quantitative',
      },
      `the first attribute is of type "quantitative"`
    );
    test.end();
  }
);

tape(
  'get(mockEndpoint, "unknownfile.json") throws an exception',
  async test => {
    await test.rejects(
      get(mockEndpoint, 'unknownfile.json'),
      Error,
      'throw an exception if file is unknown or could not be fetched'
    );
    test.end();
  }
);

tape(
  'get(mockEndpoint, "bad-dataset-*.json") throws an exception',
  async test => {
    await test.rejects(
      get(mockEndpoint, 'bad-dataset-not-an-array.json'),
      Error,
      'throw an exception if the JSON is not an array'
    );
    await test.rejects(
      get(mockEndpoint, 'bad-dataset-not-strings.json'),
      Error,
      'throw an exception if the JSON is not an array of strings'
    );
    test.end();
  }
);

tape('get(1, "dataset.json") throws an exception', async test => {
  await test.rejects(
    get(1, 'dataset.json'),
    TypeError,
    'throw an exception if endpoint parameter is not a function or a string'
  );
  test.end();
});

tape('get(mockEndpoint, 1) throws an exception', async test => {
  await test.rejects(
    get(mockEndpoint, 1),
    TypeError,
    'throw an exception if file parameter is not a string'
  );
  test.end();
});
