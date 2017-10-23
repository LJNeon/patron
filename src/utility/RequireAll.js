const fs = require('fs');
const regexes = {
  excludeDir: /^\./,
  filter: /^([^.].*)\.js(on)?$/
};

module.exports = function r(o) {
  const modules = {};
  const files = fs.readdirSync(o);
  files.forEach((i) => {
    const path = o + '/' + i;
    const name = i.match(regexes.filter);

    if (fs.statSync(path).isDirectory() && !regexes.excludeDir.test(i)) {
      modules[i] = r(path);
    } else if (name) {
      modules[name[1] || name[0]] = require(path);
    }
  });
  return modules;
};
