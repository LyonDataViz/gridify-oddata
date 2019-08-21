import {ENDPOINT, INDEX_FILE} from './constants';

const getFetchFromString = endpoint => relativeFile => {
  return fetch(endpoint + relativeFile).then(d => d.json());
};

export async function fetchAllFromEndpoint(endpoint, file) {
  const index = await fetchFromEndpoint(endpoint, file);
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

export async function fetchFromEndpoint(endpoint, file) {
  if (typeof file !== 'string') {
    throw new TypeError('file parameter must be a string');
  }
  let fetchFn;
  if (typeof endpoint === 'function') {
    fetchFn = endpoint;
  } else if (typeof endpoint === 'string') {
    fetchFn = getFetchFromString(endpoint);
  } else {
    throw new TypeError(
      'endpoint parameter must be a string (endpoint base URL) or an API fetch function'
    );
  }
  // In case the promise rejects, don't catch the exception
  return fetchFn(file);
}

export async function fetchAll(file = INDEX_FILE) {
  return fetchAllFromEndpoint(ENDPOINT, file);
}

export async function fetchOne(file) {
  return fetchFromEndpoint(ENDPOINT, file);
}