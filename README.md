# gridify-oddata

Javascript module to fetch origin-destination data with gridify required fields.

For example (TBD), to lazily fetch "random" origin-destination data:

```js
oddata.fetch('random/random-data.json');
```

Or to fetch all the origin-destination data from
'https://raw.githubusercontent.com/LyonDataViz/oddata-public/master/' endpoint:

```js
oddata.fetchAll(
  'https://raw.githubusercontent.com/LyonDataViz/oddata-public/master/'
);
```

## Installing

If you use NPM, `npm install @gridify/oddata`. Otherwise, download the
[latest release](https://github.com/LyonDataViz/gridify-oddata/releases/latest).
AMD, CommonJS, and vanilla environments are supported.

## API Reference

<a name="fetchAll" href="#fetchAll">#</a>
oddata.<b>fetchAll</b>([<i>endpoint</i>][, <i>indexfile</i>])
[<>](https://github.com/LyonDataViz/gridify-oddata/blob/master/src/fetch.js 'Source')

Fetches a JSON list of datasets (_indexfile_) from _endpoint_, and returns it as
an array of strings.

_endpoint_ is an URL, and defaults to
'https://raw.githubusercontent.com/LyonDataViz/oddata-public/master/'. It may
also be a promise that takes a string (a relative path like `dataset.json`, or
`path/to/index.json`) as an input and resolves to an array of strings.

_indexfile_ is the name of the relative JSON file that contains an array of
dataset relative files, eg `['random/random-data.json']`. It defaults to
'dataset.json'.
