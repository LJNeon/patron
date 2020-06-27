/*
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2020  patron contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
"use strict";
const {copyFileSync} = require("fs");
const path = require("path");
const {Application, ReflectionKind} = require("typedoc");

function handleType(type) {
  console.info(type.type);
}

try {
  require("eris");
}catch{
  throw new ReferenceError("Documentation needs Eris to be installed to generate.");
}

copyFileSync(path.join(__dirname, "../types/eris.d.ts"), path.join(__dirname, "../types/lib.d.ts"));
console.info("\nLibrary typings generated.");

const app = new Application();

app.bootstrap({
  mode: "file",
  target: "ES5",
  includeDeclarations: true,
  excludeNotExported: true,
  excludeExternals: true
});

const project = app.convert(app.expandInputFiles([
  path.join(__dirname, "../types/index.d.ts"),
  path.join(__dirname, "../node_modules/eris")
]));

if(project == null)
  throw new ReferenceError("Failed to convert typings.");
else
  console.info("\nTypings converted into JSON.");

const reflections = project.getReflectionsByKind(ReflectionKind.Namespace)
  .find(r => r.name === "\"patron\"").children;
const classes = {};
const enums = {};

for(const reflection of reflections) {
  switch(reflection.kind) {
    case ReflectionKind.Enum:
      enums[reflection.name] = reflection.children.map(child => ({
        name: child.name,
        description: child.comment.shortText
      }));

      break;
    case ReflectionKind.Class:
      classes[reflection.name] = {description: reflection.comment.shortText};

      for(const group of reflection.groups) {
        switch(group.kind) {
          case ReflectionKind.Constructor:
            classes[reflection.name].constructors = group.children[0].signatures
              .map(sig => sig.parameters?.map(param => ({
                name: param.name,
                optional: param.flags.includes("Optional"),
                type: handleType(param.type)
              })));

            break;
        }
      }

      break;
  }
}
