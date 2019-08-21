export function checkMandatory(object, property) {
  if (!(property in object)) {
    throw new Error('`' + property + '` property is mandatory.');
  }
}

export function checkType(object, property, type) {
  if (property in object && typeof object[property] !== type) {
    throw new TypeError('`' + property + '` must be of type ' + type + '.');
  }
}

export function checkAttribute(attribute) {
  if (!('name' in attribute && 'type' in attribute)) {
    throw new Error('attributes must have "name" and "type" keys');
  }
  if (typeof attribute.name !== 'string') {
    throw new TypeError('attribute name must be a string');
  }
  if (attribute.type !== 'categorical' && attribute.type !== 'quantitative') {
    throw new Error('attribute type must be "categorical" or "quantitative"');
  }
}
