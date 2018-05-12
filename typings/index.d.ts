declare module 'patron.js' {
  export class Argument {
    private static validateArgument(argument: Argument, name: string): void;
    public name: string;
    public key: string;
    public typeReader: TypeReader;
    public example: string;
    public defaultValue: any;
    public infinite: boolean;
    public preconditions: ArgumentPrecondition[];
    public optional: boolean;
    public remainder: boolean;
    constructor(options: ArgumentOptions);
  }

  export enum ArgumentDefault {
    Author,
    Message,
    Member,
    Channel,
    Guild,
    HighestRole
  }

  export class ArgumentPrecondition {
    private static validateArgumentPrecondition(registry: ArgumentPrecondition, name: string): void;
    public name: string;
    public description: string;
    public run(command: Command, message: object, argument: Argument, args: object, value: any, options: any, custom: any): Promise<PreconditionResult>;
    constructor(options: ArgumentPreconditionOptions);
  }

  export class ArgumentResult {
    public args: object;
    private constructor(options: ArgumentResultOptions);
  }

  export class Command {
    private static validateCommand(command: Command, name: string): void;
    public names: string[];
    public group: Group;
    public description: string;
    public usableContexts: Symbol[];
    public memberPermissions: string[];
    public botPermissions: string[];
    public preconditions: Precondition[];
    public args: Argument[];
    public hasCooldown: boolean;
    public cooldown: number;
    private cooldowns: object;
    constructor(options: CommandOptions);
    public run(message: object, args: object, custom: any): Promise<any>;
    public getUsage(): string;
    public getExample(): string;
  }

  export enum CommandError {
    Precondition,
    MemberPermission,
    BotPermission,
    TypeReader,
    CommandNotFound,
    Cooldown,
    InvalidArgCount,
    Exception,
    InvalidContext
  }

  export enum Context {
    DM,
    Guild
    Group
  }

  export class CooldownResult extends Result {
    public remaining: number;
    private constructor(options: CooldownResultOptions);
  }

  export class ExceptionResult extends Result {
    public error: Error;
    private constructor(options: ExceptionResultOptions);
  }

  export class Group {
    private static validateGroup(group: Group, name: string): void;
    public name: string;
    public description: string;
    public preconditions: Precondition[];
    public commands: Command[];
    constructor(options: GroupOptions);
  }

  export class Handler {
    public registry: Registry;
    public parseCommand(message: object, prefixLength: number): Promise<Result>;
    public validateCommand(message: object, command: Command): Promise<Result | InvalidContextResult>;
    public runCommandPreconditions(message: object, command: Command, ...custom): Promise<Result | PreconditionResult>;
    public checkCooldown(message: object, command: Command): Promise<Result | CooldownResult>;
    public parseArguments(message: object, command: Command, prefixLength: number, ...custom): Promise<ArgumentResult | TypeReaderResult | PreconditionResult>;
    public updateCooldown(message: object, command: Command): Promise<Result>;
    public run(message: object, prefixLength: number, ...custom): Promise<Result | CooldownResult | ExceptionResult | PreconditionResult | TypeReaderResult>;
    constructor(registry: Registry);
  }

  export class InvalidContextResult {
    public context: Symbol;
    private constructor(options: ResultOptions);
  }

  export enum Library {
    DiscordJS,
    Eris
  }

  export class Precondition {
    private static validatePrecondition(registry: Precondition, name: string): void;
    public name: string;
    public description: string;
    public run(command: Command, message: object, options: any, custom: any): Promise<PreconditionResult>;
    constructor(options: PreconditionOptions);
  }

  export class PreconditionResult extends Result {
    public static fromSuccess(): PreconditionResult;
    public static fromError(command: Command, reason: string): PreconditionResult;
    private constructor(options: ResultOptions);
  }

  export class Registry {
    private static validateRegistry(registry: Registry, name: string): void;
    public commands: Command[];
    public groups: Group[];
    public typeReaders: TypeReader[];
    public preconditions: Precondition[];
    public argumentPreconditions: ArgumentPrecondition[];
    public library: string;
    public registerArgumentPreconditions(argumentPreconditions: ArgumentPrecondition[]): Registry;
    public registerCommands(commands: Command[]): Registry;
    public registerGlobalTypeReaders(): Registry;
    public registerGroups(groups: Group[]): Registry;
    public registerLibraryTypeReaders(): Registry;
    public registerPreconditions(preconditions: Precondition[]): Registry;
    public registerTypeReaders(typeReaders: TypeReader[]): Registry;
    public unregisterArgumentPreconditions(argumentPreconditions: ArgumentPrecondition[]): Registry;
    public unregisterCommands(commands: Command[]): Registry;
    public unregisterGlobalTypeReaders(): Registry;
    public unregisterGroups(groups: Group[]): Registry;
    public unregisterLibraryTypeReaders(): Registry;
    public unregisterPreconditions(preconditions: Precondition[]): Registry;
    public unregisterTypeReaders(typeReaders: TypeReader[]): Registry;
    constructor(options: RegistryOptions);
  }

  export class Result {
    public success: boolean;
    public command?: Command;
    public commandName?: string;
    public commandError?: CommandError;
    public errorReason?: string;
    constructor(options: ResultOptions);
  }

  export function RequireAll(path: string): Promise<object[]>;

  export class TypeReader {
    private static validateTypeReader(typeReader: TypeReader, name: string): void;
    public type: string;
    public description: string;
    public read(command: Command, message: object, argument: Argument, args: object, input: string, custom: any): Promise<TypeReaderResult>;
    constructor(options: TypeReaderOptions);
  }

  export class TypeReaderResult extends Result {
    public static fromSuccess(value: any): TypeReaderResult;
    public static fromError(command: Command, reason: string, matches?: object[]): TypeReaderResult;
    public value: any;
    public matches?: object[];
    constructor(options: TypeReaderResultOptions);
  }

  interface ArgumentOptions {
    name: string;
    key: string;
    type: string;
    example: string;
    defaultValue?: any;
    infinite?: boolean;
    preconditions?: string[] | object[];
    remainder?: boolean;
  }

  interface ArgumentPreconditionOptions {
    name: string;
    description?: string;
  }

  interface ArgumentResultOptions extends ResultOptions {
    args: object;
  }

  interface CommandOptions {
    names: string[];
    groupName: string;
    description?: string;
    usableContexts?: symbol[];
    memberPermissions?: string[];
    botPermissions?: string[];
    preconditions?: string[] | object[];
    args?: Argument[];
    cooldown?: number;
  }

  interface CooldownResultOptions extends ResultOptions {
    remaining: number;
  }

  interface ExceptionResultOptions extends ResultOptions {
    error: Error;
  }

  interface GroupOptions {
    name: string;
    description?: string;
    preconditions?: string[] | object[];
  }

  interface PreconditionOptions {
    name: string;
    description?: string;
  }

  interface RegistryOptions {
    library: string;
  }

  interface ResultOptions {
    success: boolean;
    command?: Command;
    commandName?: string;
    commandError?: CommandError;
    errorReason?: string;
  }

  interface TypeReaderOptions {
    type: string;
    description?: string;
  }

  interface TypeReaderResultOptions extends ResultOptions {
    value?: any;
    matches?: object[];
  }
}
