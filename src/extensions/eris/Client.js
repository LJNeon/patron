const eris = require('eris');

Object.defineProperty(eris.Client.prototype, 'channels', {
  get: function () {
    return [...this.privateChannels.values(), ...([...this.guilds.values()].reduce((a, b) => [...a, ...b.channels.values()], []))];
  }
});

Object.defineProperty(eris.Client.prototype, 'emojis', {
  get: function () {
    return [...this.guilds.values()].reduce((a, b) => [...a, ...b.emojis], []);
  }
});
