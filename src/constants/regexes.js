module.exports = {
  argument: /"[\S\s]+?"|[\S\n]+/g,
  id: /^\d{17,19}/,
  whiteSpace: /\s/,
  parseId: /\D+/g,
  permission: /[A-Z]+/g,
  quotes: /^"|"$/g,
  quotesMatch: /^"[\S\s]+"$/g,
  roleMention: /^<@&\d+>/,
  textChannelMention: /^<#\d+>/,
  usernameAndDiscrim: /.+#\d{4}/,
  userMention: /^<@!?\d+>/
};
