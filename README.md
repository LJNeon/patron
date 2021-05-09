<p align="center">
  <a href="https://github.com/LJNeon/patron"><img src="https://i.imgur.com/6j61q1V.png" width="600" alt="Patron"/></a>
  <br/>
  <a href="https://discord.gg/Dn6k7bm"><img src="https://img.shields.io/discord/409140755391578142?color=ae2929&label=support&logo=discord&style=flat-square" alt="Discord Server"/></a>
  <a href="https://www.npmjs.com/package/patron"><img src="https://img.shields.io/npm/v/patron?color=ae2929&style=flat-square" alt="NPM Version"/></a>
  <a href="https://www.npmjs.com/package/patron"><img src="https://img.shields.io/npm/dt/patron?color=ae2929&style=flat-square" alt="NPM Downloads"/></a>
  <a href="https://travis-ci.org/LJNeon/patron"><img src="https://img.shields.io/travis/LJNeon/patron/master?color=ae2929&style=flat-square" alt="Build Status"/></a>
  <a href="https://david-dm.org/LJNeon/patron"><img src="https://img.shields.io/david/LJNeon/patron?color=ae2929&style=flat-square" alt="Dependencies"/></a>
  <a href="https://github.com/LJNeon/patron/blob/master/LICENSE"><img src="https://img.shields.io/github/license/LJNeon/patron?color=ae2929&style=flat-square" alt="License"/></a>
</p>

## About
**Patron** is an efficient and maintainable command framework for [discord.js](https://github.com/hydrabolt/discord.js) and [Eris](https://github.com/abalabahaha/eris) that aims for true flexibility. Patron doesn't have a modified client, manage the message event for you, or clutter other libraries with extensions. Patron has full support for TypeScript, as well as ECMAScript Modules.

## Should I use Patron?
Patron isn't designed for beginners, but for those who want a highly flexible framework and fast development time. Bots with complex or many features will see higher maintainability and reusable code.

## Installation
Patron is available on NPM and can be installed easily.
```js
npm install patron
```
If you are using TypeScript (or rely on typings for code completion) you will need to use an additional command to properly set up typings. You need to have the Discord library installed beforehand. This command will need to be run again if you switch between libraries.
```js
npx patron --typings=eris // or 'discordjs'
```

## Documentation
Patron's API documentation is in [an `index.d.ts` file](https://github.com/LJNeon/patron/blob/master/types/index.d.ts) with detailed comments, and there's a [folder of guides](https://github.com/LJNeon/patron/blob/master/guides) explaining features with example code.
