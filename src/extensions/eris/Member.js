const eris = require('eris');

Object.defineProperty(eris.Member.prototype, 'highestRole', {
  get: function () {
    return this.roles.map((role) => this.guild.roles.get(role)).find((role) => this.guild.roles.filter((r) => r.position > role.position).length === 0);
  }
});
