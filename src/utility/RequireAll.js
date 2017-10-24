const fs = require('fs');
const regexes = {
  excludeDir: /^\./,
  filter: /^([^.].*)\.js(on)?$/
};

function requireAll(path) {
  const modules = {};
  const files = fs.readdirSync(path);

  files.forEach((file) => {
    const parsedPath = path + '/' + file;
    const name = file.match(regexes.filter);

    if (fs.statSync(parsedPath).isDirectory() === true && regexes.excludeDir.test(file) === false) {
      modules[file] = requireAll(parsedPath);
    } else if (name) {
      modules[name[1] || name[0]] = require(parsedPath);
    }
  });
  return modules;
}

module.exports - requireAll;
