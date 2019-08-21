# gridify-oddata

Javascript module to fetch origin-destination data with gridify required fields.

## Installing

If you use NPM, `npm install @gridify/oddata`. Otherwise, download the
[latest release](https://github.com/LyonDataViz/gridify-oddata/releases/latest).
AMD, CommonJS, and vanilla environments are supported.

## API Reference

<a name="get" href="#get">#</a> <b>get</b>()
[<>](https://github.com/LyonDataViz/gridify-oddata/blob/master/src/get.js 'Source')

Fetches the list of datasets from https://github.com/LyonDataViz/oddata-public
repository (using the
[`dataset.json` file](https://github.com/LyonDataViz/oddata-public/blob/master/dataset.json)),
and returns it as an array.

Each element of the array contains the parsed JSON metadata of the dataset, with
fields `name` and `file`.
