const fs = require('fs');
const Constants = require('./Constants.js');

function requireAll(path) {
  const files = fs.readdirSync(path);
  const modules = [];

  for (let i = 0; i < files.length; i++) {
    const parsedPath = path + '/' + files[i];
    const name = files[i].match(Constants.regexes.filter);

    if (fs.statSync(parsedPath).isDirectory() === true && Constants.regexes.excludeDir.test(files[i]) === false) {
      modules.push(...requireAll(parsedPath));
    } else if (name !== null) {
      modules.push(require(parsedPath));
    }
  }

  return modules;
}

module.exports = requireAll;
