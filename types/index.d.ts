import {Message} from "./lib";

declare module "patron.js" {
  type MaybePromise<T> = T | Promise<T>;

  export enum ArgumentDefault {
    Author,
    Channel,
    Guild,
    HighestRole,
    Member,
    Message
  }

  export enum Context {
    DM,
    Guild
  }

  export enum ResultType {
    ArgumentCount,
    ClientPermission,
    Context,
    Cooldown,
    Error,
    Execution,
    MemberPermission,
    Precondition,
    Success,
    TypeReader,
    Unknown
  }

  export class Result {
    protected constructor();
    command?: Command;
    type: ResultType;
  }

  export class CommandResult extends Result {
    private constructor();
    name?: string;
  }

  export class ContextResult extends Result {
    private constructor();
    context: Context;
  }

  export class CooldownResult extends Result {
    private constructor();
    remaining: number;
    group?: Group;
  }

  export class ErrorResult extends Result {
    private constructor();
    error: Error;
  }

  export class ExecutionResult extends Result {
    private constructor();
    value?: any;
    static fromSuccess(value?: any): ExecutionResult;
    static fromFailure(value?: any): ExecutionResult;
  }

  export class PermissionResult extends Result {
    private constructor();
    permissions: Array<string>;
  }

  export class PreconditionResult extends Result {
    private constructor();
    reason?: string;
    static fromSuccess(): PreconditionResult;
    static fromFailure(command: Command, reason: string): PreconditionResult;
  }

  export class TypeReaderResult extends Result {
    private constructor();
    matches?: Array<any>;
    reason?: string;
    value?: any;
    static fromSuccess(value: any): TypeReaderResult;
    static fromFailure(command: Command, reason: string, matches?: Array<any>): TypeReaderResult;
  }

  interface ArgumentOptions {
    defaultValue?: any;
    example?: string;
    infinite?: boolean;
    key?: string;
    name?: string;
    preconditionOptions?: Array<any>;
    preconditions?: Array<string>;
    remainder?: boolean;
    type: string;
  }

  export class Argument {
    constructor(options: ArgumentOptions);
    defaultValue: any;
    example: string;
    infinite: boolean;
    key: string;
    name: string;
    optional: boolean;
    preconditionOptions: Array<any>;
    preconditions: Array<string>;
    remainder: boolean;
    type: string;
  }

  interface ConditionOptions {
    name: string;
  }

  export class ArgumentPrecondition {
    constructor(options: ConditionOptions);
    name: string;
    run(
      value: any,
      command: Command,
      message: Message,
      argument: Argument,
      arguments: object,
      options: any
    ): MaybePromise<PreconditionResult>;
  }

  interface CommandOptions {
    arguments?: Array<Argument>;
    clientPermissions?: Array<string>;
    cooldown?: number | CooldownOptions;
    description?: string;
    group?: string;
    memberPermissions?: Array<string>;
    names: Array<string>;
    postconditionOptions?: Array<any>;
    postconditions?: Array<string>;
    preconditionOptions?: Array<any>;
    preconditions?: Array<string>;
    usableContexts?: Array<Context>;
  }

  export class Command {
    constructor(options: CommandOptions);
    arguments: Array<Argument>;
    clientPermissions: Array<string>;
    cooldowns?: Cooldown;
    description?: string;
    group?: string;
    memberPermissions: Array<string>;
    names: Array<string>;
    postconditionOptions: Array<any>;
    postconditions: Array<string>;
    preconditionOptions: Array<any>;
    preconditions: Array<string>;
    usableContexts: Array<Context>;
    run(message: Message, arguments: object): MaybePromise<ExecutionResult | void>;
    getExample(prefix?: string): string | undefined;
    getUsage(prefix?: string): string;
    getCooldown(userId: string, guildId?: string): Promise<CooldownInfo | void>;
    useCooldown(userId: string, guildId?: string): Promise<boolean>;
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
    resets: number;
    used: number;
  }

  export class Cooldown {
    constructor(options: number | CooldownOptions);
    aggressive: boolean;
    duration: number;
    limit: number;
    sorter?: CooldownSorter;
    expires?: number;
    get(userId: string, guildId?: string): Promise<CooldownInfo | void>;
    use(userId: string, guildId?: string): Promise<boolean>;
    revert(userId: string, guildId?: string): Promise<void>;
  }

  interface GroupOptions {
    cooldown?: number | CooldownOptions;
    description?: string;
    name: string;
    postconditionOptions?: Array<any>;
    postconditions?: Array<string>;
    preconditionOptions?: Array<any>;
    preconditions?: Array<string>;
  }

  export class Group {
    constructor(options: GroupOptions);
    cooldowns?: Cooldown;
    description?: string;
    name: string;
    postconditionOptions: Array<any>;
    postconditions: Array<string>;
    preconditionOptions: Array<any>;
    preconditions: Array<string>;
    getCooldown(userId: string, guildId?: string): Promise<CooldownInfo | void>;
    useCooldown(userId: string, guildId?: string): Promise<boolean>;
    revertCooldown(userId: string, guildId?: string): Promise<void>;
  }

  type Results = CommandResult | ContextResult | CooldownResult | ErrorResult
    | PermissionResult | PreconditionResult | TypeReaderResult;

  interface HandlerOptions {
    argumentRegex?: RegExp;
    separator?: string;
    registry: Registry;
  }

  export class Handler {
    constructor(options: HandlerOptions);
    defaultRegex: boolean;
    argumentRegex: RegExp;
    separator: string;
    registry: Registry;
    run(message: Message, prefixLength: number): Promise<Results>;
  }

  export class Postcondition {
    constructor(options: ConditionOptions);
    name: string;
    run(message: Message, value: any, options: any): Promise<void>;
  }

  export class Precondition {
    constructor(options: ConditionOptions);
    name: string;
    run(command: Command, message: Message, options: any): MaybePromise<PreconditionResult>;
  }

  type RegistryMap<V> = Map<string, V>;

  interface RegistryOptions {
    caseSensitive?: boolean;
    defaultReaders?: boolean;
  }

  export class Registry {
    constructor(options: RegistryOptions);
    caseSensitive: boolean;
    defaultReaders: boolean;
    argumentPreconditions: RegistryMap<ArgumentPrecondition>;
    commands: RegistryMap<Command>;
    groups: RegistryMap<Group>;
    postconditions: RegistryMap<Postcondition>;
    preconditions: RegistryMap<Precondition>;
    typeReaders: RegistryMap<TypeReader>;
    getGroupedCommands(groupName: string): Array<Command>;
    getArgumentPrecondition(name: string): ArgumentPrecondition | void;
    getCommand(name: string): Command | void;
    getGroup(name: string): Group | void;
    getPostcondition(name: string): Postcondition | void;
    getPrecondition(name: string): Precondition | void;
    getTypeReader(type: string): TypeReader | void;
    registerArgumentPreconditions(conditions: Array<ArgumentPrecondition>): this;
    unregisterArgumentPreconditions(names: Array<string>): this;
    registerCommands(commands: Array<Command>): this;
    unregisterCommands(names: Array<string>): this;
    registerGroups(groups: Array<Group>): this;
    unregisterGroups(names: Array<string>): this;
    registerPostconditions(conditions: Array<Postcondition>): this;
    unregisterPostconditions(names: Array<string>): this;
    registerPreconditions(conditions: Array<Precondition>): this;
    unregisterPreconditions(names: Array<string>): this;
    registerTypeReaders(readers: Array<TypeReader>): this;
    unregisterTypeReaders(types: Array<string>): this;
  }

  interface TypeReaderOptions {
    type: string;
  }

  export class TypeReader {
    constructor(options: TypeReaderOptions);
    default: boolean;
    type: string;
    read(
      input: string,
      command: Command,
      message: Message,
      argument: Argument,
      arguments: object
    ): MaybePromise<TypeReaderResult>;
  }

  export class Mutex {
    constructor();
    lock(): Promise<void>;
    unlock(): void;
  }

  export function ImportAll(directory: string): Promise<Array<object>>;

  export function RequireAll(directory: string): Promise<Array<object>>;

  export function RequireAllSync(directory: string): Array<object>;
}
