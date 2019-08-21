import {ENDPOINT, INDEX_FILE} from './constants';
import {fetchList} from './fetchList';
import {fetchFile} from './fetchFile';

export async function getAll(endpoint, file) {
  return fetchList(endpoint, file).then(list =>
    list.map(file => fetchFile(endpoint, file))
  );
}

export async function getAllDefault() {
  return getAll(ENDPOINT, INDEX_FILE);
}
