module.exports = {
  argument: /"[\S\s]+?"|[\S\n]+/g,
  id: /^[0-9]+$/,
  noWhiteSpace: /\s/,
  parseTextChannelId: /<#|>/g,
  parseRoleId: /<@&|>/g,
  parseUserId: /<@|!|>/g,
  quotes: /^"|"$/g,
  roleMention: /^<@&[0-9]+>$/,
  textChannelMention: /^<#[0-9]+>$/,
  usernameAndDiscrim: /^.+#\d{4}$/,
  userMention: /^<@!?[0-9]+>$/
};