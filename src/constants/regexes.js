export default {
  argument: /"[\S\s]+?"|[\S\n]+/g,
  id: /^\d{17,19}/,
  whiteSpace: /\s/,
  parseId: /\D+/g,
  permission: /[A-Z]+/g,
  quotes: /^"|"$/g,
  roleMention: /^<@&\d+>/,
  textChannelMention: /^<#\d+>/,
  usernameAndDiscrim: /.+#\d{4}/,
  userMention: /^<@!?\d+>/
};
