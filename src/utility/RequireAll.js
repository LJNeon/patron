const fs = require('fs');
const regexes = {
  excludeDir: /^\./,
  filter: /^([^.].*)\.js(on)?$/
};

function requireAll(path) {
  const modules = [];
  const files = fs.readdirSync(path);

  files.forEach((file) => {
    const parsedPath = path + '/' + file;
    const name = file.match(regexes.filter);

    if (fs.statSync(parsedPath).isDirectory() === true && regexes.excludeDir.test(file) === false) {
      modules.push(...requireAll(parsedPath));
    } else if (name !== null) {
      modules.push(require(parsedPath));
    }
  });
  return modules;
}

module.exports = requireAll;
