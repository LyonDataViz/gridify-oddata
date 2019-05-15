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

<a name="fetchAll" href="#fetchAll">#</a> oddata.<b>fetchAll</b>([<i>file</i>])
[<>](https://github.com/LyonDataViz/gridify-oddata/blob/master/src/fetch.js 'Source')

Fetches the list of datasets from https://github.com/LyonDataViz/oddata-public
repository, and returns it as an array of strings. _file_ is the name of index
file, it defaults to `dataset.json`.

<a name="fetchOne" href="#fetchOne">#</a> oddata.<b>fetchOne</b>(<i>file</i>)
[<>](https://github.com/LyonDataViz/gridify-oddata/blob/master/src/fetch.js 'Source')

Fetches _file_ from https://github.com/LyonDataViz/oddata-public repository.

<a name="fetchFromEndpoint" href="#fetchFromEndpoint">#</a>
oddata.<b>fetchFromEndpoint</b>(<i>endpoint</i>, <i>file</i>)
[<>](https://github.com/LyonDataViz/gridify-oddata/blob/master/src/fetch.js 'Source')

Fetches relative JSON _file_ from _endpoint_, and returns it parsed.

_endpoint_ is the URL of the API endpoint, or a promise that takes a string
(_file_) as an input and resolves to an array of strings.

_file_ is a filename relative to the endpoint URL.

<a name="fetchAllFromEndpoint" href="#fetchAllFromEndpoint">#</a>
oddata.<b>fetchAllFromEndpoint</b>(<i>endpoint</i>, <i>file</i>)
[<>](https://github.com/LyonDataViz/gridify-oddata/blob/master/src/fetch.js 'Source')

Fetches a JSON list of datasets (_file_) from _endpoint_, and returns it as an
array of strings.

_endpoint_ is the URL of the API endpoint, or a promise that takes a string
(_file_) as an input and resolves to an array of strings.

_file_ is the name of index file, eg `dataset.json`, that must contain an array
of datasets filenames.
