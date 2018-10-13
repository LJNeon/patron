const discord = require('discord.js');

discord.Collection.prototype.filterValues = function (fn) {
  const results = [];

  for (const value of this.values()) {
    if (fn(value)) {
      results.push(value);
    }
  }

  return results;
};

discord.Collection.prototype.findValue = function (fn) {
  for (const value of this.values()) {
    if (fn(value)) {
      return value;
    }
  }

  return undefined;
};
