import {ENDPOINT, INDEX_FILE, LOAD_LIMIT} from './constants';
import {fetchList} from './fetchList';
import {fetchFile} from './fetchFile';
import {parse} from './parse';

export async function get(endpoint, indexFile, loadLimit = LOAD_LIMIT) {
  const list = await fetchList(endpoint, indexFile);
  const metadata = await Promise.all(
    list.map(file =>
      fetchFile(endpoint, file).then(json => parse(json, loadLimit))
    )
  );
  return metadata;
}

export async function getDefault() {
  return get(ENDPOINT, INDEX_FILE, LOAD_LIMIT);
}
