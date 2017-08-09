<div align="center">
    <br />
    <p>
        <a href="https://github.com/RealBlazeIt/patron.js"><img src="https://i.imgur.com/6j61q1V.png" width="600" alt="patron.js" /></a>
    </p>
    <br />
    <a href="https://discord.gg/gvyma7H"><img src="https://discordapp.com/api/guilds/290759415362224139/embed.png" alt="Discord Server" /></a>
    <a href="https://www.npmjs.com/package/patron.js"><img src="https://img.shields.io/npm/v/patron.js.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/patron.js"><img src="https://img.shields.io/npm/dt/patron.js.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://travis-ci.org/RealBlazeIt/patron.js"><img src="https://travis-ci.org/RealBlazeIt/patron.js.svg?branch=master" alt="Build Status" /></a>
    <a href="https://david-dm.org/RealBlazeIt/patron.js"><img src="https://david-dm.org/RealBlazeIt/patron.js.svg" alt="Dependencies" /></a>
</div>

## About
[Patron.js](https://realblazeit.github.io/patron.js/) is the most efficient, stable and reliable [discord.js](https://github.com/hydrabolt/discord.js) command framework. Contrary to all other competitors, this is the only framework that provides true flexibility. This framework does not have it's own client, it does not manage the message event for you, it does not clutter discord.js's classes with loads of extensions and it most certainly does not send messages on your behalf. Having a command framework that internally handles how it should respond to the user when an error occurs in no way should be considered as flexible.

This is why patron.js uses a direct and entirely customizable approach to handling command results. A result object is returned on command execution, giving highly detailed and easily manageable information regarding the execution result. Depending on the error, you can chose whether or not to respond to the user, how to respond, whether or not you wish to use patron.js's provided error reasons, or provide your own, whether you wish to console log the errors, or whatever it may be to exactly fit your needs.

The reason this command framework will always remain up to date and fully featured is because I directly depend on this framework in my bot, [DEA](https://github.com/RealBlazeIt/dea), used by thousands of servers. The second any slight issue or complication arises, I am the first to hear about it, fixing it within hours. Stability and efficiency are my top priorities with patron.js. Every single aspect of this framework has been tested and optimized. For example, we use custom methods to loop through discord.js's collections in our type readers for massive performance improvements.

Finally, patron.js supports asyncronous code, *everywhere*. Not just in the command execution, but *everywhere*. In argument preconditions, normal preconditions, type readers, and everywhere else, all methods are `async`. No other discord.js frameworks allow you to have asyncronous preconditions, also known as inhibitors. This is simply to ensure that things such as asyncronous methods to either check a database or a file in a precondition are fully supported, as they should be.

## Command Results
Every single command execution returns a result object. This [result](https://realblazeit.github.io/patron.js/Result.html) object will always have the `success` property. If the command execution was unsuccessful, this property will be set to false. If this is the case, the result will also have the [commandError](https://realblazeit.github.io/patron.js/global.html#CommandError) property, allowing you to handle the error and respond (or not) accordingly. These are the current command errors:
- `Precondition`
- `MemberPermission`
- `BotPermission`
- `TypeReader`
- `GuildOnly`
- `CommandNotFound`
- `Cooldown`
- `InvalidArgCount`
- `Exception`

Depending on which error occurred, the result object will have different properties. [This is an example](https://github.com/VapidSlay/selfbot/blob/master/src/services/CommandService.js) of how these errors may be handled.

## Arguments
Patron.js's arguments are entirely unique from all other command frameworks, as they allow for contextual default values. For example, if you have a user argument in your command, you can set the default of this argument to `ArgumentDefault.Author`. [This enum](https://realblazeit.github.io/patron.js/global.html#ArgumentDefault) allows you to set defaults of arguments based off the context in which the command was used. 

Furthermore, this framework has the most featured, efficient and reliable type readers. For example, the user type reader can parse a user object based off of an id, mention, username, or nickname (if they are in a guild). If there are multiple matches found, it will an unsuccessful [TypeReaderResult](https://realblazeit.github.io/patron.js/TypeReaderResult.html) with the matches in question in the error reason. If there are too many matches to list, it will simply ask the user to be more specific. All available type readers are [here](https://github.com/RealBlazeIt/patron.js/tree/master/src/readers).

[This is an example](https://github.com/RealBlazeIt/dea/blob/master/src/commands/moderation/Kick.js) of DEA making use of this argument system. As you can see, all examples are argument specific, which is the best approach for maintainability. Most command frameworks will allow you to provide an example string for each command, however, these examples are often forgetten and not updated while the arguments themselves change, leaving inconsistencies throughout the commands. Not to mention this system allows you to create a single commonly used argument object, such as a user, and share this accross all files, to prevent redudancy and code repetition, while still allowing for the command usage example to always be up to date.

## Preconditions
There are currently two types of preconditions: [Preconditions](https://realblazeit.github.io/patron.js/Precondition.html) and [Argument Preconditions](https://realblazeit.github.io/patron.js/ArgumentPrecondition.html). Normal preconditions can be added on any on [Command](https://realblazeit.github.io/patron.js/Command.html) or [Group](https://realblazeit.github.io/patron.js/Group.html), while argument preconditions may only be added to arguments. All preconditions must return a [PreconditionResult](https://realblazeit.github.io/patron.js/PreconditionResult.html). If the result in question is unsuccessful, it will be the returned result in the command handler.

## Support
First and foremost, [docs](https://realblazeit.github.io/patron.js/index.html) are your best friend. There are multiple features in patron.js that I simply did not cover to prevent this from becoming a 28 page essay. All the information about these features are available in the documentation. Keep in mind this framework is not meant for inexperienced coders, it is meant for people that want a genuinely reliable command framework and more maintainable code overall. If you do run into road blocks, or simply want a nudge in the right direction, you may join our [Discord Server](https://discord.gg/gvyma7H) and ask me in the #help channel. 
