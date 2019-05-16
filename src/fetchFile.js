export async function fetchJson(endpoint, file) {
  if (typeof file !== 'string') {
    throw new TypeError('file parameter must be a string');
  }
  let fetchFn;
  if (typeof endpoint === 'function') {
    fetchFn = endpoint;
  } else if (typeof endpoint === 'string') {
    fetchFn = file => {
      return fetch(endpoint + file).then(d => d.json());
    };
  } else {
    throw new TypeError(
      'endpoint parameter must be a string (endpoint base URL) or an API fetch function'
    );
  }
  // In case the promise rejects, don't catch the exception
  return fetchFn(file);
}

export async function fetchFile(endpoint, file) {
  if (typeof file !== 'string') {
    throw new TypeError('file parameter must be a string');
  }
  let fetchFn;
  if (typeof endpoint === 'function') {
    fetchFn = endpoint;
  } else if (typeof endpoint === 'string') {
    fetchFn = file => {
      return fetch(endpoint + file);
    };
  } else {
    throw new TypeError(
      'endpoint parameter must be a string (endpoint base URL) or an API fetch function'
    );
  }
  // In case the promise rejects, don't catch the exception
  return fetchFn(file);
}
