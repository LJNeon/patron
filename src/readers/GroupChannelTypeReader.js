const TypeReader = require('../structures/TypeReader.js');
const TypeReaderResult = require('../results/TypeReaderResult.js');
const TypeReaderUtil = require('../utility/TypeReaderUtil.js');
const constants = require('../utility/Constants.js');

class GroupChannelTypeReader extends TypeReader {
  constructor() {
    super({ type: 'groupchannel' });
  }

  async read(command, message, argument, input) {
    if (constants.regexes.id.test(input) === true) {
      const channel = message.client.channels.get(input.match(constants.regexes.findId)[0]);

      if (channel !== undefined && channel.type === 'group') {
        return TypeReaderResult.fromSuccess(channel);
      }
    }

    const lowerInput = input.toLowerCase();

    const matches = message.client.channels.filterValues((v) => v.name !== null && v.name.toLowerCase().includes(lowerInput) && v.type === 'group');

    return TypeReaderUtil.handleMatches(command, matches, 'groupChannelNotFound');
  }
}

module.exports = new GroupChannelTypeReader();
