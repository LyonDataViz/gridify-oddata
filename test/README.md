# A note about tests

Modules are imported in test files using ESM syntax, not CJS. For example:

```javascript
import {fetchList} from '../src/fetchList';
```

As ESM are not natively supported by [tape](https://www.npmjs.com/package/tape):

1. esm package must be installed
2. tape must be called with "-r esm" parameter

The advantages are:

- allowing to test functions directly from their modules, without them all being
  exported by index.js,
- doesn't require any previous build step (rollup).
