import {ENDPOINT, INDEX_FILE} from './constants';
import {fetchList} from './fetchList';
import {fetchJson} from './fetchFile';
import {parse} from './parse';

export async function get(endpoint, indexFile) {
  const list = await fetchList(endpoint, indexFile);
  const metadata = await Promise.all(
    list.map(file =>
      fetchJson(endpoint, file).then(json => parse(json, endpoint))
    )
  );
  return metadata;
}

export async function getDefault() {
  return get(ENDPOINT, INDEX_FILE);
}
