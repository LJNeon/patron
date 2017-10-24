const eris = require('eris');

Object.defineProperty(eris.Message.prototype, 'guild', {
  get: function () {
    return this.channel.guild !== undefined ? this.channel.guild : null;
  }
});
