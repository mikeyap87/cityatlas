import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

function ensureFile(relativePath, contents) {
  const targetPath = join(root, relativePath);
  if (existsSync(targetPath)) return;
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, contents);
}

function replaceInFile(relativePath, searchValue, replaceValue) {
  const targetPath = join(root, relativePath);
  if (!existsSync(targetPath)) return;
  const current = readFileSync(targetPath, "utf8");
  if (!current.includes(searchValue)) return;
  writeFileSync(targetPath, current.replace(searchValue, replaceValue));
}

ensureFile(
  "node_modules/react/index.js",
  `'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/react.production.js');
} else {
  module.exports = require('./cjs/react.development.js');
}
`,
);

ensureFile(
  "node_modules/scheduler/index.js",
  `'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/scheduler.production.js');
} else {
  module.exports = require('./cjs/scheduler.development.js');
}
`,
);

ensureFile(
  "node_modules/rolldown/node_modules/@rolldown/pluginutils/index.js",
  `export * from "./dist/index.mjs";
`,
);

ensureFile(
  "node_modules/rolldown/node_modules/@rolldown/pluginutils/filter/index.js",
  `export * from "../dist/filter/index.mjs";
`,
);

ensureFile(
  "node_modules/rolldown/node_modules/@rolldown/pluginutils/dist/index.mjs",
  `export {
  and,
  code,
  exclude,
  exprInterpreter,
  id,
  importerId,
  include,
  interpreter,
  interpreterImpl,
  moduleType,
  not,
  or,
  queries,
  query,
} from "../../../../../@rolldown/pluginutils/dist/filter/composable-filters.js";
export {
  exactRegex,
  makeIdFiltersToMatchWithQuery,
  prefixRegex,
} from "../../../../../@rolldown/pluginutils/dist/filter/simple-filters.js";
export { filterVitePlugins } from "../../../../../@rolldown/pluginutils/dist/filter/filter-vite-plugins.js";
`,
);

ensureFile(
  "node_modules/rolldown/node_modules/@rolldown/pluginutils/dist/filter/index.mjs",
  `export * from "../index.mjs";
`,
);

replaceInFile(
  "node_modules/tinyglobby/dist/index.mjs",
  'import { fdir } from "fdir";\nimport picomatch from "picomatch";',
  'import * as fdirModule from "fdir";\nimport picomatch from "picomatch";\nconst fdir = fdirModule.fdir ?? fdirModule.Builder ?? fdirModule.default;',
);
