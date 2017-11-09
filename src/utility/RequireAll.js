const fs = require('fs');
const Constants = require('./Constants.js');

/**
 * A function which returns all module exports of a folder.
 * @param {string} path The path in question.
 * @returns {object[]} An array of all the module exports.
 */
function RequireAll(path) {
  const files = fs.readdirSync(path);
  const modules = [];

  for (let i = 0; i < files.length; i++) {
    const parsedPath = path + '/' + files[i];
    const name = files[i].match(Constants.regexes.filter);

    if (fs.statSync(parsedPath).isDirectory() === true && Constants.regexes.excludeDir.test(files[i]) === false) {
      modules.push(...RequireAll(parsedPath));
    } else if (name !== null) {
      modules.push(require(parsedPath));
    }
  }

  return modules;
}

module.exports = RequireAll;
