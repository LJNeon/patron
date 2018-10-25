declare module "patron.js" {
  export enum ArgumentDefault {
    Author,
    Channel,
    Guild,
    HighestRole,
    Member,
    Message
  }

  export enum CommandError {
    BotPermission,
    Command,
    Cooldown,
    Exception,
    InvalidArgCount,
    InvalidContext,
    MemberPermission,
    Precondition,
    TypeReader,
    UnknownCmd
  }

  export enum Context {
    DM,
    Guild
  }

  export enum Library {
    DiscordJS,
    Eris
  }

  export enum TypeReaderCategory {
    Global,
    Library,
    User
  }

  export class Result {
    public command?: Command;
    public commandError?: CommandError;
    public commandName?: string;
    public errorReason?: string;
    public success: boolean;
    private constructor(options: ResultOptions);
    public static fromSuccess(command?: Command): Result;
  }

  export class ArgumentResult extends Result {
    public args: object;
    private constructor(options: ArgumentResultOptions);
    public static fromInvalidCount(command: Command): Result;
    public static fromSuccess(command: Command, args: object): ArgumentResult;
  }

  export class CommandResult extends Result {
    public data: any;
    private constructor(options: CommandResultOptions);
    public static fromError(reason: string, data: any): CommandResult;
    public static fromUnknown(commandName: string): Result;
    private setCommand(command: Command): void;
  }

  export class CooldownResult extends Result {
    public remaining: number;
    private constructor(options: CooldownResultOptions);
    public static fromError(command: Command, remaining: number): CooldownResult;
  }

  export class ExceptionResult extends Result {
    public error: Error;
    private constructor(options: ExceptionResultOptions);
    public static fromError(command: Command, error: Error): ExceptionResult;
  }

  export class InvalidContextResult extends Result {
    public context: Symbol;
    private constructor(options: InvalidContextResultOptions);
    public static fromError(command: Command, context: Symbol): InvalidContextResult;
  }

  export class PermissionResult extends Result {
    public permissions: string[];
    private constructor(options: PermissionResultOptions);
    public static format(permissions: string[]): string;
    public static fromBot(command: Command, permissions: string[]): PermissionResult;
    public static fromMember(command: Command, permissions: string[]): PermissionResult;
  }

  export class PreconditionResult extends Result {
    public static fromSuccess(): PreconditionResult;
    public static fromError(command: Command, reason: string): PreconditionResult;
  }

  export class TypeReaderResult extends Result {
    public matches?: object[];
    public value: any;
    private constructor(options: TypeReaderResultOptions);
    public static fromError(command: Command, reason: string, matches?: object[]): TypeReaderResult;
    public static fromSuccess(value: any): TypeReaderResult;
  }

  export class Argument {
    public defaultValue: any;
    public example: string;
    public infinite: boolean;
    public key: string;
    public name: string;
    public optional: boolean;
    public preconditionOptions: object[];
    public preconditions: ArgumentPrecondition[];
    public remainder: boolean;
    public typeReader: TypeReader;
    constructor(options: ArgumentOptions);
  }

  export class ArgumentPrecondition {
    public description: string;
    public name: string;
    constructor(options: ArgumentPreconditionOptions);
    public run(command: Command, message: object, argument: Argument, args: object, value: any, options: any): Promise<PreconditionResult>;
  }

  export class Command {
    public args: Argument[];
    public botPermissions: string[];
    public cooldowns?: Cooldown;
    public description: string;
    public group: Group;
    public hasCooldown: boolean;
    public memberPermissions: string[];
    public names: string[];
    public postconditionOptions: object[];
    public postconditions: Postcondition[];
    public preconditionOptions: object[];
    public preconditions: Precondition[];
    public usableContexts: Symbol[];
    constructor(options: CommandOptions);
    public getUsage(): string;
    public getExample(): string;
    public revertCooldown(userId: string, guildId?: string): Promise;
    public run(message: object, args: object): Promise<any>;
    public updateCooldown(userId: string, guildId?: string): Promise<boolean>;
  }

  export class Cooldown {
    public limit: number;
    public sorter?: function;
    public time: number;
    constructor(options: number | CooldownOptions);
    public get(userId: string, guildId?: string): Promise<?object>;
    public revert(userId: string, guildId?: string): Promise;
    public use(userId: string, guildId?: string): Promise<boolean>;
  }

  export class Group {
    public commands: Command[];
    public description: string;
    public name: string;
    public postconditionOptions: object[];
    public postconditions: Postcondition[];
    public preconditionOptions: object[];
    public preconditions: Precondition[];
    constructor(options: GroupOptions);
  }

  export class Handler {
    public argumentRegex: RegExp;
    public hasDefaultRegex: boolean;
    public registry: Registry;
    constructor(options: HandlerOptions);
    public parseArguments(message: object, command: Command, prefixLength: number): Promise<ArgumentResult | PreconditionResult | TypeReaderResult>;
    public parseCommand(message: object, prefixLength: number): Promise<Result>;
    public revertCooldown(message: object, command: Command): Promise;
    public run(message: object, prefixLength: number): Promise<CooldownResult | ExceptionResult | PreconditionResult | TypeReaderResult | Result>;
    public runCommandPostconditions(message: object, command: Command, result: any): void;
    public runCommandPreconditions(message: object, command: Command): Promise<PreconditionResult | Result>;
    public updateCooldown(message: object, command: Command): Promise<CooldownResult | Result>;
    public validateCommand(message: object, command: Command): Promise<InvalidContextResult | Result>;
  }

  export class Postcondition {
    public description: string;
    public name: string;
    constructor(options: PostconditionOptions);
    public run(command: Command, message: object, result: CommandResult, options: any): void;
  }

  export class Precondition {
    public description: string;
    public name: string;
    constructor(options: PreconditionOptions);
    public run(command: Command, message: object, options: any): Promise<PreconditionResult>;
  }

  export class Registry {
    public argumentPreconditions: ArgumentPrecondition[];
    public caseSensitive: boolean;
    public commands: Command[];
    public groups: Group[];
    public library: string;
    public postconditions: Postcondition[];
    public preconditions: Precondition[];
    public typeReaders: TypeReader[];
    public registerArgumentPreconditions(argumentPreconditions: ArgumentPrecondition[]): Registry;
    public registerCommands(commands: Command[]): Registry;
    public registerGlobalTypeReaders(): Registry;
    public registerGroups(groups: Group[]): Registry;
    public registerLibraryTypeReaders(): Registry;
    public registerPostconditions(postconditions: Postcondition[]): Registry;
    public registerPreconditions(preconditions: Precondition[]): Registry;
    public registerTypeReaders(typeReaders: TypeReader[]): Registry;
    public unregisterArgumentPreconditions(argumentPreconditions: string[]): Registry;
    public unregisterCommands(commands: string[]): Registry;
    public unregisterGlobalTypeReaders(): Registry;
    public unregisterGroups(groups: string[]): Registry;
    public unregisterLibraryTypeReaders(): Registry;
    public unregisterPostconditions(postconditions: string[]): Registry;
    public unregisterPreconditions(preconditions: string[]): Registry;
    public unregisterTypeReaders(typeReaders: string[]): Registry;
    constructor(options: RegistryOptions);
  }

  export class TypeReader {
    public category: TypeReaderCategory;
    public description: string;
    public type: string;
    constructor(options: TypeReaderOptions);
    public read(command: Command, message: object, argument: Argument, args: object, input: string): Promise<TypeReaderResult>;
  }

  export class MultiMutex {
    public sync(id: any, task: function): Promise<any>;
  }

  export class Mutex {
    public sync(task: function): Promise<any>;
  }

  export function RequireAll(path: string) : Promise<any[]>;

  interface ResultOptions {
    command?: Command;
    commandError?: CommandError;
    commandName?: string;
    errorReason?: string;
    success: boolean;
  }

  interface ArgumentResultOptions extends ResultOptions {
    args: object;
  }

  interface CommandResultOptions extends ResultOptions {
    data: any;
  }

  interface CooldownResultOptions extends ResultOptions {
    remaining: number;
  }

  interface ExceptionResultOptions extends ResultOptions {
    error: Error;
  }

  interface InvalidContextResultOptions extends ResultOptions {
    context: Symbol;
  }

  interface PermissionResultOptions extends ResultOptions {
    permissions: string[];
  }

  interface TypeReaderResultOptions extends ResultOptions {
    matches?: object[];
    value: any;
  }

  interface ArgumentOptions {
    defaultValue?: any;
    example: string;
    infinite?: boolean;
    key: string;
    name: string;
    preconditionOptions?: any[];
    preconditions?: string[];
    remainder?: boolean;
    type: string;
  }

  interface ArgumentPreconditionOptions {
    description?: string;
    name: string;
  }

  interface CommandOptions {
    args?: Argument[];
    botPermissions?: string[];
    cooldown?: number | object;
    description?: string;
    groupName: string;
    memberPermissions?: string[];
    names: string[];
    postconditionOptions?: object[];
    postconditions?: string[];
    preconditionOptions?: object[];
    preconditions?: string[];
    usableContexts?: symbol[];
  }

  interface CooldownOptions {
    limit: number;
    sorter?: function;
    time: number;
  }

  interface GroupOptions {
    description?: string;
    name: string;
    postconditionOptions?: object[];
    postconditions?: string[];
    preconditionOptions?: object[];
    preconditions?: string[];
  }

  interface HandlerOptions {
    argumentRegex: RegExp;
    registry: Registry;
  }

  interface PostconditionOptions {
    description?: string;
    name: string;
  }

  interface PreconditionOptions {
    description?: string;
    name: string;
  }

  interface RegistryOptions {
    caseSensitive?: boolean;
    library: string;
  }

  interface TypeReaderOptions {
    description?: string;
    type: string;
  }
}
