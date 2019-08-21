import {ENDPOINT, INDEX_FILE} from './constants';
import {fetchList} from './fetchList.js';
import {fetchFile} from './fetchFile.js';

export async function getAll(endpoint, file) {
  return fetchList(endpoint, file).then(list =>
    list.map(file => fetchFile(endpoint, file))
  );
}

export async function getAllDefault() {
  return getAll(ENDPOINT, INDEX_FILE);
}
