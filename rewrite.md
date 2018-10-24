# 3.1.0

### Added
 - `Cooldown` class, which allows for detailed configuration of `Command` cooldowns.
 - `PermissionResult` class, which allows for clearer organization of the permission results.

### Changed
 - Massive cleanup of the entire source code, including updating to a much better and stricter eslint configuration.
 - Updated dev dependencies.
 - `Registry#unregister[Class]s` now accepts string names instead of the full `[Class]` instances.
 - Renamed `CommandError#CommandNotFound` to `CommandError#UnknownCmd`.
 - Discord.js `TypeReader`s are now written based on the GitHub master version of discord.js.
 - DM Channel `TypeReader` will now accept a user as input and return their DMs.
 - Built-in `TypeReader`s are now tested.
 - `ArgumentPrecondition`s, `Precondition`s, and `Postconditions`s can no longer be referenced by an incomplete object.
 - Removed results from `Constants` in favor of `static` methods on the `Result` classes.
 - Moved `PermissionUtil#format` to `PermissionResult#format`.
 - `[Class]#validate[Class]` methods now only validate types, and the `Registry#register[Class]s` methods validate the values.

### Removed
 - All documentation of private internal methods.
 - Quantity TypeReader.
 - The `...custom` parameter from the `ArgumentPrecondition`, `Command`, `Handler`, `Postcondition`, `Precondition`, and `TypeReader` run methods.
