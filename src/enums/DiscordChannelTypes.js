/**
 * The discord channel types.
 * @enum {number}
 * @readonly
 */

const DiscordChannelTypes = {
  /** A guild text channel. */
  TextChannel: 0,
  /** A DM channel. */
  DM: 1,
  /** A guild voice channel. */
  VoiceChannel: 2,
  /** A group channel. */
  GroupChannel: 3,
  /** A guild category. */
  GuildCategory: 4
};

module.exports = DiscordChannelTypes;
