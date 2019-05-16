import {checkMandatory, checkType, checkAttribute} from './check';
import {autoType, dsvFormat} from 'd3-dsv';
import {doc} from './doc';
import {DateTime} from 'luxon';
import {fetchText} from './fetchFile';

export function parseRaw(json) {
  const raw = {};

  // title
  checkMandatory(json, 'name');
  checkType(json, 'name', 'string');
  raw.Title = json.name;

  // item
  raw.Item = raw.Title.replace(/\W/g, '_').replace(/^([0-9])/, '_$1');

  // csv
  checkMandatory(json, 'file');
  checkType(json, 'file', 'string');
  raw.CSV = json.file;
  // separator
  // we should check it is only one character
  checkType(json, 'separator', 'string');
  raw.Separator = json.separator || ',';
  // dateformat
  checkType(json, 'separator', 'string');
  if (json.dateformat) raw.Dateformat = json.dateformat;

  // some other metadata
  checkType(json, 'description', 'string');
  if (json.description) raw.description = json.description;
  checkType(json, 'author', 'string');
  if (json.author) raw.author = json.author;
  checkType(json, 'source', 'string');
  if (json.source) raw.source = json.source;

  // meta
  if (json.meta) {
    raw.meta = Object.keys(json.meta).reduce((meta, key) => {
      checkType(json.meta, key, 'string');
      meta[key] = json.meta[key];
      return meta;
    }, {});
  }

  // attributes
  if (json.attributes) {
    raw.attributes = json.attributes.map(attribute => {
      checkAttribute(attribute);
      return {
        name: attribute.name,
        type: attribute.type,
      };
    });
  }

  // doc
  raw.Doc = doc(raw);

  // process
  raw.Process = function(parsedRow) {
    parsedRow = autoType(parsedRow);
    if (raw.meta) {
      for (let key in raw.meta) {
        const alias = raw.meta[key];
        if (alias in parsedRow) {
          parsedRow[key] = parsedRow[alias];
          if (key.match(/date/)) {
            if (!raw.Dateformat) {
              //throw new Error('dateformat field is required to parse CSV');
              parsedRow[key] = DateTime.fromFormat(parsedRow[alias]).toJSDate();
            } else {
              parsedRow[key] = DateTime.fromFormat(
                parsedRow[alias],
                raw.Dateformat
              ).toJSDate();
            }
          }
        }
      }
    }
    // avoid nulls which break @tmcw/tables
    for (let key in parsedRow) if (parsedRow[key] === null) parsedRow[key] = '';
    return parsedRow;
  };
  return raw;
}

export function parse(json, endpoint) {
  const raw = parseRaw(json);

  return {
    raw: raw,
    title: raw.Title,
    get data() {
      // Problem here: endpoint could be a function that returns a JSON... tbf
      return fetchText(endpoint, raw.CSV).then(csv =>
        dsvFormat(raw.Separator).parse(csv, raw.Process)
      );
    },
    get doc() {
      return raw.Doc;
    },
  };
}
