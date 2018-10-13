const fs = require('fs');
const util = require('util');
const lstat = util.promisify(fs.lstat);
const readDir = util.promisify(fs.readdir);

/**
 * A function which returns all module exports of a folder.
 * @param {string} path The path in question.
 * @returns {Promise<object[]>} An array of all the module exports.
 */
async function RequireAll(path) {
  const files = await readDir(path);
  const modules = [];

  for (let i = 0; i < files.length; i++) {
    const parsedPath = path + '/' + files[i];

    if ((await lstat(parsedPath)).isDirectory() && files[i].charAt(0) !== '.') {
      modules.push(...(await RequireAll(parsedPath)));
    /* eslint-disable no-magic-numbers */
    } else if (files[i].lastIndexOf('.js') === files[i].length - 3 || files[i].lastIndexOf('.json') === files[i].length - 5) {
    /* eslint-enable no-magic-numbers */
      modules.push(require(parsedPath));
    }
  }

  return modules;
}

module.exports = RequireAll;
