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
    public remainder: boolean;
    public optional: boolean;
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

  export class Command {
    private static validateCommand(command: Command, name: string): void;
    public names: string[];
    public group: Group;
    public description: string;
    public guildOnly: boolean;
    public dmOnly: boolean;
    public memberPermissions: string[];
    public botPermissions: string[];
    public preconditions: Precondition[];
    public args: Argument[];
    public coooldown: number;
    public hasCooldown: boolean;
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
    GuildOnly,
    CommandNotFound,
    Cooldown,
    InvalidArgCount,
    Exception,
    DmOnly
  }

  export class CooldownResult extends Result {
    public remaining: number;
    public static fromError(command: Command, remaining: number): CooldownResult;
    private constructor(options: CooldownResultOptions);
  }

  export class ExceptionResult extends Result {
    public error: Error;
    public static fromError(command: Command, error: Error): ExceptionResult;
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
    public run(message: object, prefix: string, ...custom): Promise<Result | CooldownResult | ExceptionResult | PreconditionResult | TypeReaderResult>;
    constructor(registry: Registry);
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
    public library: string;
    public commands: Command[];
    public groups: Group[];
    public typeReaders: TypeReader[];
    public preconditions: Precondition[];
    public argumentPreconditions: ArgumentPrecondition[];
    constructor(options: RegistryOptions);
    public registerGlobalTypeReaders(): Registry;
    public registerLibraryTypeReaders(): Registry;
    public registerTypeReaders(typeReaders: TypeReader[]): Registry;
    public registerGroups(groups: Group[]): Registry;
    public registerCommands(commands: Command[]): Registry;
    public registerArgumentPreconditions(argumentPreconditions: ArgumentPrecondition[]): Registry;
    public registerPreconditions(preconditions: Precondition[]): Registry;
    constructor(options: RegistryOptions);
  }

  export class Result {
    public success: boolean;
    public command?: Command;
    public commandError?: CommandError;
    public errorReason?: string;
    constructor(options: ResultOptions);
  }

  export function RequireAll(path: string): object[];

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
    remainder?: boolean;
    preconditions?: string[] | object[];
  }

  interface ArgumentPreconditionOptions {
    name: string;
    description?: string;
  }

  interface CommandOptions {
    names: string[];
    groupName: string;
    description?: string;
    guildOnly?: boolean;
    dmOnly?: boolean;
    userPermissions?: string[];
    botPermissions?: string[];
    preconditions?: string[] | object[];
    args?: Argument[];
    cooldown?: number;
  }

  interface CooldownResultOptions extends ResultOptions {
    cooldown: number;
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

  interface ResultOptions {
    success: boolean;
    command?: Command;
    commandError?: CommandError;
    errorReason?: string;
  }

  interface TypeReaderOptions {
    type: string;
    description?: string;
  }

  interface RegistryOptions {
    library: string;
  }

  interface TypeReaderResultOptions extends ResultOptions {
    value?: any;
    matches?: object[];
  }
}
