# A note about tests

Modules are imported in test files using ESM syntax, not CJS. For example:

```javascript
import {fetchList} from '../src/fetchList';
```

As it's not natively supported by [tape](https://www.npmjs.com/package/tape), it
requires:

1. esm package being installed
2. tape being called with "-r esm" parameter

The advantages are:

- allow to test functions directly from their modules, without them all being
  exported by index.js,
- doesn't require any previous build step (rollup).
