import {fetchFile} from './fetchFile';

export async function fetchList(endpoint, file) {
  const list = await fetchFile(endpoint, file);
  if (
    !Array.isArray(list) ||
    list.some(dataset => typeof dataset !== 'string')
  ) {
    throw new TypeError(
      'indexFile must be a JSON array of strings. See https://github.com/LyonDataViz/oddata-public.'
    );
  }
  return list;
}
