import {checkMandatory, checkType, checkAttribute} from '../src/check';

// Required modules
const tape = require('tape');

const obj1 = {key: 'value'};
const obj2 = {key: 42};

// checkMandatory
tape('checkMandatory', test => {
  test.doesNotThrow(
    () => checkMandatory(obj1, 'key'),
    `checkMandatory({key: "value"}, "key") does not throw error`
  );
  test.throws(
    () => checkMandatory(obj1, 'unknownKey'),
    Error,
    `checkMandatory({key: "value"}, "unknownKey") throws an error`
  );
  test.end();
});

// checkType
tape('checkType', test => {
  test.doesNotThrow(
    () => checkType(obj1, 'key', 'string'),
    `checkType({key: "value"}, "key", "string") does not throw error`
  );
  test.doesNotThrow(
    () => checkType(obj1, 'unknownKey', 'string'),
    `checkType({key: "value"}, "unknownKey", "string") does not throw error`
  );
  test.doesNotThrow(
    () => checkType(obj2, 'unknownKey', 'string'),
    `checkType({key: 42}, "unknownKey", "string") does not throw error`
  );
  test.throws(
    () => checkType(obj1, 'key', 'number'),
    TypeError,
    `checkType({key: "value"}, "key", "number") throws an error`
  );
  test.throws(
    () => checkType(obj2, 'key', 'string'),
    TypeError,
    `checkType({key: 42}, "key", "string") throws an error`
  );
  test.end();
});

// checkAttribute
tape('checkAttribute', test => {
  test.doesNotThrow(
    () => checkAttribute({name: 'x1', type: 'categorical'}),
    `checkAttribute({name: "x1", type: "categorical"}) does not throw error`
  );
  test.doesNotThrow(
    () => checkAttribute({name: 'x1', type: 'quantitative'}),
    `checkAttribute({name: "x1", type: "quantitative"}) does not throw error`
  );
  test.throws(
    () => checkAttribute({name: 'x1'}),
    Error,
    `checkAttribute({name: 'x1'}) throws an error`
  );
  test.throws(
    () => checkAttribute({type: 'categorical'}),
    Error,
    `checkAttribute({type: 'categorical'}) throws an error`
  );
  test.throws(
    () => checkAttribute({name: 'x1', type: 'anothertype'}),
    Error,
    `checkAttribute({name: 'x1', type: 'anothertype'}) throws an error`
  );
  test.throws(
    () => checkAttribute({name: 42, type: 'categorical'}),
    TypeError,
    `checkAttribute({name: 42, type: 'categorical'}) throws an error`
  );
  test.end();
});
