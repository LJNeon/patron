/**
 * The discord channel types.
 * @prop {number} TextChannel A guild text channel.
 * @prop {number} DM A DM channel.
 * @prop {number} VoiceChannel A guild voice channel.
 * @prop {number} GroupChannel A group channel.
 * @prop {number} GuildCategory A guild category.
 * @enum {number}
 * @readonly
 */

const CommandError = {
  TextChannel: 0,
  DM: 1,
  VoiceChannel: 2,
  GroupChannel: 3,
  GuildCategory: 4
};

module.exports = CommandError;
