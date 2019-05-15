import {ENDPOINT, INDEX_FILE} from './constants';

const getEndpointFetch = (apiEndpoint = ENDPOINT) => relativeFile => {
  return fetch(apiEndpoint + relativeFile).then(d => d.json());
};

export async function fetchAll(endpoint = ENDPOINT, indexFile = INDEX_FILE) {
  if (typeof indexFile !== 'string') {
    throw new TypeError('indexFile parameter must be a string');
  }
  let fetchFn;
  if (typeof endpoint === 'function') {
    fetchFn = endpoint;
  } else if (typeof endpoint === 'string') {
    fetchFn = getEndpointFetch(endpoint);
  } else {
    throw new TypeError(
      'endpoint parameter must be a string (endpoint base URL) or an API fetch function'
    );
  }

  // In case the promise rejects, don't catch the exception
  const index = await fetchFn(indexFile);
  if (
    !Array.isArray(index) ||
    index.some(dataset => typeof dataset !== 'string')
  ) {
    throw new TypeError(
      'indexFile must be a JSON array of strings. See https://github.com/LyonDataViz/oddata-public.'
    );
  }
  return index;
}
