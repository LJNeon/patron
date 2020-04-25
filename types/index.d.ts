// Documentation link rules:
// 1. From a different Category.
// 2. Not linked as a Type.
// 3. Not linked previously in the Class / Object.
// 4. Links are spaced out when possible.

import {Message, PermissionName} from "./lib";

declare module "patron" {
  type MaybePromise<T> = T | Promise<T>;

  /**
   * Various contextual default values for an [[Argument]].
   * @category Enums
   */
  export enum ArgumentDefault {
    /** The User who used the [[Command]]. */
    Author,
    /** The Channel the Command was used in. */
    Channel,
    /** The Guild the Command was used in. */
    Guild,
    /** The highest Role of the Member who used the Command. */
    HighestRole,
    /** The Member who used the Command. */
    Member,
    /** The Message that used the Command. */
    Message
  }

  /**
   * Contexts that [[Command]]s may be used in.
   * @category Enums
   */
  export enum Context {
    /** Usable in DMs. */
    DM,
    /** Usable in Guilds. */
    Guild
  }

  /**
   * The various results of running the [[Handler]].
   * @category Enums
   */
  export enum ResultType {
    /** The amount of Arguments provided was incorrect. */
    ArgumentCount,
    /** An Argument wasn't in the correct order. */
    ArgumentOrder,
    /** Client lacks required Permissions. */
    ClientPermission,
    /** Command was used in an invalid [[Context]]. */
    Context,
    /** Command is on [[Cooldown]]. */
    Cooldown,
    /** An Error was thrown during the [[Command]]'s execution. */
    Error,
    /** Command explicitly failed when ran. */
    Execution,
    /** The Member who used the Command lacks required Permissions. */
    MemberPermission,
    /** A [[Precondition]] failed when ran. */
    Precondition,
    /** Command was successfully executed. */
    Success,
    /** The [[TypeReader]] failed when ran */
    TypeReader,
    /** Command used is unknown. */
    Unknown
  }

  /**
   * A basic result.
   * @category Results
   */
  export class Result {
    /** @hidden */
    protected constructor();
    /** The executed Command, if obtainable. */
    command?: Command;
    /** The type of the result. */
    type: ResultType;
  }

  /**
   * A failed result from [[Command]] parsing.
   * @category Results
   */
  export class CommandResult extends Result {
    /** @hidden */
    private constructor();
    /** The name of the unknown Command, if relevant. */
    name?: string;
    /** The incorrect amount of [[Argument]]s, if relevant. */
    count?: number;
    /** The incorrectly ordered Argument, if relevent. */
    unordered?: Argument;
  }

  /**
   * A failed result due to an invalid Context.
   * @category Results
   */
  export class ContextResult extends Result {
    /** @hidden */
    private constructor();
    /** The Context the [[Command]] was executed in. */
    context: Context;
  }

  /**
   * A failed result due to a [[Cooldown]].
   * @category Results
   */
  export class CooldownResult extends Result {
    /** @hidden */
    private constructor();
    /** The amount of time remaining on the Cooldown in milliseconds. */
    remaining: number;
    /** The Group the Cooldown was on, if the Cooldown wasn't on a [[Command]]. */
    group?: Group;
  }

  /**
   * A failed result due to a thrown Error.
   * @category Results
   */
  export class ErrorResult extends Result {
    /** @hidden */
    private constructor();
    /** A thrown Error. */
    error: Error;
  }

  /**
   * A failed result which can revert [[Cooldown]]s and pass a value to Postconditions.
   * @category Results
   */
  export class ExecutionResult extends Result {
    /** @hidden */
    private constructor();
    /** The value to pass to any [[Postcondition]]s. */
    value?: unknown;
    /**
     * Generates a successful result which can pass a value to Postconditions.
     * @param value The value to pass to any Postconditions.
     */
    static fromSuccess(value?: unknown): ExecutionResult;
    /**
     * Generates a failed result which reverts Cooldowns and can pass a value to Postconditions.
     * @param value The value to pass to any Postconditions.
     */
    static fromFailure(value?: unknown): ExecutionResult;
  }

  /**
   * A failed result due to missing Permissions.
   * @category Results
   */
  export class PermissionResult extends Result {
    /** @hidden */
    private constructor();
    /** The missing Permissions. */
    permissions: PermissionName[];
  }

  /**
   * A [[Precondition]] result.
   * @category Results
   */
  export class PreconditionResult extends Result {
    /** @hidden */
    private constructor();
    /** The reason for a failure, if relevant. */
    reason?: string;
    /** Generates a successful Precondition result. */
    static fromSuccess(): PreconditionResult;
    /**
     * Generates a failed Precondition result.
     * @param command The executed Command.
     * @param reason The reason for the failure.
     */
    static fromFailure(command: Command, reason: string): PreconditionResult;
  }

  /**
   * A [[TypeReader]] result.
   * @category Results
   */
  export class TypeReaderResult extends Result {
    /** @hidden */
    private constructor();
    /** A list of all values if multiple values were parsed. */
    matches?: unknown[];
    /** The reason for the failure, if relevant. */
    reason?: string;
    /** The parsed value. */
    value?: unknown;
    /**
     * Generates a successful TypeReader result.
     * @param value The parsed value.
     */
    static fromSuccess(value: unknown): TypeReaderResult;
    /**
     * Generates a failed TypeReader result.
     * @param command The executed Command.
     * @param reason The reason for the failure.
     * @param matches A list of all values if multiple values were parsed.
     */
    static fromFailure(command: Command, reason: string, matches?: unknown[]): TypeReaderResult;
  }

  interface ArgumentOptions {
    defaultValue?: any;
    example?: string;
    infinite?: boolean;
    key?: string;
    name?: string;
    preconditionOptions?: any[];
    preconditions?: string[];
    remainder?: boolean;
    type: string;
    typeOptions?: any;
  }

  /**
   * An Argument for a Command.
   * @category Commands
   */
  export class Argument {
    constructor(options: ArgumentOptions);
    /** The value to use if no value is provided. */
    defaultValue: any;
    /** An example of valid input. */
    example: string;
    /**
     * Accepts an unlimited amount of values, returning them in an Array.
     * @remarks Default=false
     */
    infinite: boolean;
    /** The property name used for the parsed Arguments object supplied to the Command, defaults to the type. */
    key: string;
    /** The name used in Command#getUsage(), defaults to the type. */
    name: string;
    /** Options provided to the ArgumentPreconditions. */
    preconditionOptions: any[];
    /** Names of ArgumentPreconditions to run. */
    preconditions: string[];
    /** Parses the full remainder of the command. */
    remainder: boolean;
    /** The name of the TypeReader to use. */
    type: string;
    /** Options provided to the TypeReader */
    typeOptions: any;
  }

  interface ConditionOptions {
    name: string;
  }

  /**
   * A condition that must be passed in order to validate an Argument.
   * @category Commands
   */
  export class ArgumentPrecondition {
    constructor(options?: ConditionOptions);
    /** The condition's name. */
    name: string;
    /**
     * Executes the condition on an Argument.
     * @remarks Abstract
     * @param value The parsed value.
     * @param command The executed Command.
     * @param message The received Message.
     * @param argument The Argument being parsed.
     * @param arguments The values of previous Arguments.
     * @param options Options provided by the Argument.
     */
    run(
      value: unknown,
      command: Command,
      message: Message,
      argument: Argument,
      arguments: object,
      options: unknown
    ): MaybePromise<PreconditionResult>;
  }

  type MaybeArgument = ArgumentOptions | Argument;

  interface CommandOptions {
    arguments?: MaybeArgument[];
    clientPermissions?: PermissionName[];
    cooldown?: number | CooldownOptions;
    description?: string;
    group?: string;
    memberPermissions?: PermissionName[];
    names: string[];
    postconditionOptions?: any[];
    postconditions?: string[];
    preconditionOptions?: any[];
    preconditions?: string[];
    usableContexts?: Context[];
  }

  interface DefaultCommandOptions {
    clientPermissions?: PermissionName[];
    cooldown?: number | CooldownOptions;
    memberPermissions?: PermissionName[];
    postconditionOptions?: any[];
    postconditions?: string[];
    preconditionOptions?: any[];
    preconditions?: string[];
    usableContexts?: Context[];
  }

  /**
   * A Command that Users can execute.
   * @category Commands
   */
  export class Command {
    constructor(options?: CommandOptions);
    /** This Command's Arguments */
    arguments: Argument[];
    /** Permissions that the Client needs to run this Command. */
    clientPermissions: PermissionName[];
    /** Cooldown options and all User cooldowns. */
    cooldowns?: Cooldown;
    /** A description of this Command. */
    description?: string;
    /** The Group this Command is in, if any. */
    group?: string;
    /** Permissions that Members need to use this Command. */
    memberPermissions: PermissionName[];
    /** Names this Command can be referenced by. */
    names: string[];
    /** Options provided to the Postconditions. */
    postconditionOptions: any[];
    /** Names of Postconditions to run. */
    postconditions: string[];
    /** Options provided to the Preconditions. */
    preconditionOptions: any[];
    /** Names of Preconditions to run. */
    preconditions: string[];
    /** A list of Contexts this Command can run in. */
    usableContexts: Context[];
    /**
     * Sets default Command options.
     * @param options The default Command options.
     */
    static setDefaults(options: DefaultCommandOptions) : void;
    /**
     * Executes this Command.
     * @remarks Abstract
     * @param message The received Message.
     * @param arguments The parsed and validated Arguments.
     * @returns Returns or resolves once execution is complete, can provide a value to Postconditions.
     */
    run(message: Message, arguments?: object): MaybePromise<ExecutionResult | void>;
    /**
     * Generates an example of this Command's use.
     * @param prefix The prefix to display.
     * @returns Will return nothing if any Arguments have no example.
     */
    getExample(prefix?: string): string | void;
    /**
     * Generates the usage of this Command.
     * @param prefix The prefix to display.
     */
    getUsage(prefix?: string): string;
    /**
     * Requests the status of a User's cooldown for this Command.
     * @param userId A User ID.
     * @param guildId A Guild ID.
     * @returns Resolves to a User's information if found.
     */
    getCooldown(userId: string, guildId?: string): Promise<CooldownInfo | void>;
    /**
     * Adds a use to a User's Cooldown for this Command.
     * @param userId A User ID.
     * @param guildId A Guild ID.
     * @returns Whether or not the User is currently on cooldown.
     */
    useCooldown(userId: string, guildId?: string): Promise<boolean>;
    /**
     * Reverts a use from a User's Cooldown for this Command.
     * @param userId A User ID.
     * @param guildId A Guild ID.
     */
    revertCooldown(userId: string, guildId?: string): Promise<void>;
  }

  type CooldownSorter = (userId: string, guildId?: string) => any;

  interface CooldownOptions {
    aggressive?: boolean;
    duration: number;
    limit?: number;
    sorter?: CooldownSorter;
    expires?: number;
  }

  interface CooldownInfo {
    reset: number;
    used: number;
  }

  /**
   * Atomic Cooldowns used for Commands.
   * @category Commands
   */
  export class Cooldown {
    constructor(options: number | CooldownOptions);
    /** Will be set to the full duration on every use past the limit. */
    aggressive: boolean;
    /** Duration in milliseconds. */
    duration: number;
    /** Maximum amount of uses allowed per User. */
    limit: number;
    /** Allows custom sorting of user cooldowns, returns a key used to determine which cooldown will be applied. */
    sorter?: CooldownSorter;
    /** Age entries should be deleted at in minutes. Entires won't be cleared by default. */
    expires?: number;
    /**
     * Requests the status of a User's Cooldown.
     * @param userId A User ID.
     * @param guildId A Guild ID.
     * @returns Resolves to a User's information if found.
     */
    getCooldown(userId: string, guildId?: string): Promise<CooldownInfo | void>;
    /**
     * Adds a use to a User's Cooldown.
     * @param userId A User ID.
     * @param guildId A Guild ID.
     * @returns Whether or not the User is currently on cooldown.
     */
    useCooldown(userId: string, guildId?: string): Promise<boolean>;
    /**
     * Reverts a use from a User's Cooldown.
     * @param userId A User ID.
     * @param guildId A Guild ID.
     */
    revertCooldown(userId: string, guildId?: string): Promise<void>;
  }

  interface GroupOptions {
    cooldown?: number | CooldownOptions;
    description?: string;
    name: string;
    postconditionOptions?: any[];
    postconditions?: string[];
    preconditionOptions?: any[];
    preconditions?: string[];
  }

  interface DefaultGroupOptions {
    cooldown?: number | CooldownOptions;
    postconditionOptions?: any[];
    postconditions?: string[];
    preconditionOptions?: any[];
    preconditions?: string[];
  }

  /**
   * A categorized list of Commands.
   * @category Commands
   */
  export class Group {
    constructor(options: GroupOptions);
    /** Cooldown options and all User cooldowns. */
    cooldowns?: Cooldown;
    /** A description of this Group. */
    description?: string;
    /** The name of this Group */
    name: string;
    /** Options provided to the Postconditions. */
    postconditionOptions: any[];
    /** Names of Postconditions to run. */
    postconditions: string[];
    /** Options provided to the Preconditions. */
    preconditionOptions: any[];
    /** Names of Preconditions to run. */
    preconditions: string[];
    /**
     * Sets the default Group options.
     * @param options The default Group options.
     */
    static setDefaults(options: DefaultGroupOptions): void;
    /**
     * Requests the status of a User's cooldown for this Group.
     * @param userId A User ID.
     * @param guildId A Guild ID.
     * @returns Resolves to a User's information if found.
     */
    getCooldown(userId: string, guildId?: string): Promise<CooldownInfo | void>;
    /**
     * Adds a use to a User's Cooldown for this Group.
     * @param userId A User ID.
     * @param guildId A Guild ID.
     * @returns Whether or not the User is currently on cooldown.
     */
    useCooldown(userId: string, guildId?: string): Promise<boolean>;
    /**
     * Reverts a use from a User's Cooldown for this Group.
     * @param userId A User ID.
     * @param guildId A Guild ID.
     */
    revertCooldown(userId: string, guildId?: string): Promise<void>;
  }

  type Results = CommandResult | ContextResult | CooldownResult | ErrorResult
    | PermissionResult | PreconditionResult | TypeReaderResult;

  interface HandlerOptions {
    argumentRegex?: RegExp;
    separator?: string;
    registry: Registry;
  }

  /**
   * The Handler responsible for executing [[Command]]s.
   * @category Management
   */
  export class Handler {
    constructor(options?: HandlerOptions);
    /** Whether or not a custom RegExp for parsing argument was provided. */
    defaultRegex: boolean;
    /**
     * The RegExp used to parse [[Argument]]s from Message content.
     * @remarks Defaults to `/"[\S\s]+?"|[\S\n]+/g`.
     */
    argumentRegex: RegExp;
    /** The separator used to join pieces of a remainder Argument together. */
    separator: string;
    /** The Registry that stores everything. */
    registry: Registry;
    /**
     * Runs Preconditions for a Command.
     * @param message The received Message.
     * @param command The Command to run Preconditions on.
     */
    runPreconditions(message: Message, command: string | Command): Promise<PreconditionResult | void>
    /**
     * Attempts to execute a Command.
     * @param message The received Message.
     * @param command The Command to execute.
     * @param args The provided Arguments.
     */
    executeCommand(message: Message, command: string | Command, args: string[]): Promise<Results>;
    /**
     * Attempts to find and execute a Command.
     * @param message The received Message.
     */
    run(message: Message): Promise<Results>;
  }

  /**
   * Executed after a Command is run, can be provided with a result.
   * @category Commands
   */
  export class Postcondition {
    constructor(options?: ConditionOptions);
    /** The condition's name. */
    name: string;
    /**
     * Executes this Postconditon.
     * @remarks Abstract
     * @param command The Command being executed.
     * @param message The received Message.
     * @param value A value that can be passed from the Command.
     * @param options Options provided by the Command or Group.
     */
    run(command: Command, message: Message, value: unknown, options: unknown): Promise<void>;
  }

  /**
   * A condition that must be met in order to execute a Command.
   * @category Commands
   */
  export class Precondition {
    constructor(options?: ConditionOptions);
    /** The condition's name. */
    name: string;
    /**
     * Executes the Precondition on a Command.
     * @remarks Abstract
     * @param command The Command being executed.
     * @param message The received Message.
     * @param options Options provided by the Command or Group.
     */
    run(command: Command, message: Message, options: unknown): MaybePromise<PreconditionResult>;
  }

  type RegistryMap<V> = Map<string, V>;

  interface RegistryOptions {
    caseSensitive?: boolean;
    defaultReaders?: boolean;
  }

  /**
   * A Registry containing all [[Command]]s and other relevant items.
   * @category Management
   */
  export class Registry {
    constructor(options?: RegistryOptions);
    /** Whether or not strings should be treated as case-sensitive. */
    caseSensitive: boolean;
    /** Whether or not to register the default [[TypeReader]]s, which cover many commonly used [[Argument]] types. */
    defaultReaders: boolean;
    /** A Map of all prefixes. */
    prefixes: RegistryMap<string>;
    /** A Map of all [[ArgumentPrecondition]]s. */
    argumentPreconditions: RegistryMap<ArgumentPrecondition>;
    /** A Map of all Commands. */
    commands: RegistryMap<Command>;
    /** A Map of all [[Group]]s. */
    groups: RegistryMap<Group>;
    /** A Map of all [[Postcondition]]s. */
    postconditions: RegistryMap<Postcondition>;
    /** A Map of all [[Precondition]]s. */
    preconditions: RegistryMap<Precondition>;
    /** A Map of all TypeReaders. */
    typeReaders: RegistryMap<TypeReader>;
    /**
     * Collects a list of Commands in a Group.
     * @param groupName The Group's name.
     */
    getGroupedCommands(groupName: string): Command[];
    /**
     * Attempts to retrieve an ArgumentPrecondition.
     * @param name The condition's name.
     */
    getArgumentPrecondition(name: string): ArgumentPrecondition | void;
    /**
     * Attempts to retrieve a Command.
     * @param name The Command's name.
     */
    getCommand(name: string): Command | void;
    /**
     * Attempts to retrieve a Group.
     * @param name The Group's name.
     */
    getGroup(name: string): Group | void;
    /**
     * Attempts to retrieve a Postcondition.
     * @param name The condition's name.
     */
    getPostcondition(name: string): Postcondition | void;
    /**
     * Attempts to retrieve a Precondition.
     * @param name The condition's name.
     */
    getPrecondition(name: string): Precondition | void;
    /**
     * Attempts to retrieve a TypeReader.
     * @param type The reader's type.
     */
    getTypeReader(type: string): TypeReader | void;
    /**
     * Registers prefixes for use in a guild, or globally if no guild ID is provided.
     * @param prefixes A list of prefixes.
     * @param guildId A guild ID to limit use of the prefixes to.
     */
    registerPrefixes(prefixes: string[], guildId?: string): this;
    /**
     * Unregisters prefixes from a guild, or globally if no guild ID is provided.
     * @param prefixes A list of prefixes.
     * @param guildId A guild ID to remove prefixes from.
     */
    unregisterPrefixes(prefixes: string[] | "all", guildId?: string): this;
    /**
     * Registers a list of ArgumentPreconditions.
     * @param conditions An array or file path to a folder of conditions to register.
     */
    registerArgumentPreconditions(conditions: string | ArgumentPrecondition[]): this;
    /**
     * Unregisters a list of ArgumentPreconditions.
     * @param names An array of condition names to unregister.
     */
    unregisterArgumentPreconditions(names: string[]): this;
    /**
     * Registers a list of Commands.
     * @param commands An array or file path to a folder of Commands to register.
     */
    registerCommands(commands: string | Command[]): this;
    /**
     * Unregisters a list of Commands.
     * @param names An array of Command names to unregister.
     */
    unregisterCommands(names: string[]): this;
    /**
     * Registers a list of Groups.
     * @param groups An array or file path to a folder of Groups to register.
     */
    registerGroups(groups: string | Group[]): this;
    /**
     * Unregisters a list of Groups.
     * @param names An array of Group names to unregister.
     */
    unregisterGroups(names: string[]): this;
    /**
     * Registers a list of Postconditions.
     * @param conditions An array or file path to a folder of conditions to register.
     */
    registerPostconditions(conditions: string | Postcondition[]): this;
    /**
     * Unregisters a list of Postconditions.
     * @param names An array of condition names to unregister.
     */
    unregisterPostconditions(names: string[]): this;
    /**
     * Registers a list of Preconditions.
     * @param conditions An array or file path to a folder of conditions to register.
     */
    registerPreconditions(conditions: string | Precondition[]): this;
    /**
     * Unregisters a list of Preconditions.
     * @param names An array of condition names to unregister.
     */
    unregisterPreconditions(names: string[]): this;
    /**
     * Registers a list of TypeReaders.
     * @param readers An array or file path to a folder of readers to register.
     */
    registerTypeReaders(readers: string | TypeReader[]): this;
    /**
     * Unregisters a list of TypeReader.
     * @param types An array of reader types to unregister.
     */
    unregisterTypeReaders(types: string[]): this;
  }

  interface TypeReaderOptions {
    type: string;
  }

  /**
   * A reader that parses input into a type.
   * @category Commands
   */
  export class TypeReader {
    constructor(options?: TypeReaderOptions);
    /** Whether this reader is a default reader or user-made. */
    default: boolean;
    /** The name of the type being parsed. */
    type: string;
    /**
     * Parses the provided input into a type.
     * @remarks Abstract
     * @param input The input provided by a user.
     * @param command The executed Command.
     * @param message The received Message.
     * @param argument The Argument being parsed.
     * @param arguments The values of previous Arguments.
     */
    read(
      input: string,
      command: Command,
      message: Message,
      argument: Argument,
      arguments: unknown
    ): MaybePromise<TypeReaderResult>;
  }

  /** A Mutex. */
  export class Mutex {
    constructor();
    /**
     * Requests a lock from the Mutex.
     * @returns Resolves once the lock has been obtained.
     */
    lock(): Promise<void>;
    /** Releases a lock back to the Mutex. */
    unlock(): void;
  }

  /**
   * A function which imports all default exports. This is only available when using ECMAScript modules.
   * @category Management
   * @param directory The file path of a directory.
   * @returns An array of all the default exports.
   */
  export function ImportAll(directory: string): Promise<any[]>;

  /**
   * A function which requires all exports. This is only available when using CommonJS modules.
   * @category Management
   * @param directory The file path of a directory.
   * @returns An array of all the exports.
   */
  export function RequireAll(directory: string): Promise<any[]>;

  /**
   * A function which synchronously requires all exports. This is only available when using CommonJS modules.
   * @param directory The file path of a directory.
   * @returns An array of all the exports.
   */
  export function RequireAllSync(directory: string): any[];
}
