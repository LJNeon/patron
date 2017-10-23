const fs = require('fs');
const regexes = {
  /* eslint-disable no-useless-escape */
  excludeDir: /^\./,
  filter: /^([^\.].*)\.js(on)?$/
};

function r(o) {
  const modules = {};
  const files = fs.readdirSync(o); // eslint-disable-line no-sync
  files.forEach((i) => {
    const filepath = o + '/' + i;
    const name = i.match(regexes.filter);
    if (fs.statSync(filepath).isDirectory() && !regexes.excludeDir.test(i)) { // eslint-disable-line no-sync
      modules[i] = r(filepath);
    } else if (name) {
      modules[name[1] || name[0]] = require(filepath); // eslint-disable-line global-require
    }
  });
  return modules;
}

module.exports = r;
