declare module 'patron.js' {
  import { Collection, GuildMember, Message, User } from 'discord.js';

  export class Argument {
    private static validateArgument(argument: Argument, name: string): void;
    public readonly name: string;
    public readonly key: string;
    public readonly type: TypeReader;
    public readonly example: string;
    public readonly defaultValue: any;
    public readonly infinite: boolean;
    public readonly preconditions: ArgumentPrecondition[];
    public readonly remainder: boolean;
    public readonly optional: boolean;
    constructor(options: ArgumentOptions);
  }

  export enum ArgumentDefault {
    Author,
    Member,
    Channel,
    Guild,
    HighestRole
  }

  export class ArgumentPrecondition {
    public run(command: Command, message: Message, argument: Argument, value: any): Promise<Result>;
  }

  export class Command {
    private static validateCommand(command: Command, name: string): void;
    public readonly name: string;
    public readonly aliases: string[];
    public readonly group: Group;
    public readonly description: string;
    public readonly guildOnly: boolean;
    public readonly userPermissions: string[];
    public readonly botPermissions: string[];
    public readonly preconditions: Precondition[];
    public readonly args: Argument[];
    public readonly coooldown: number;
    public readonly hasCooldown: boolean;
    public readonly trigger: string;
    private readonly cooldowns: Collection<string, number>;
    constructor(options: CommandOptions);
    public run(message: Message, args: object): Promise<any>;
    public getUsage(): string;
    public getExample(): string;
  }

  export enum CommandError {
    Precondition,
    UserPermission,
    BotPermission,
    TypeReader,
    GuildOnly,
    CommandNotFound,
    Cooldown,
    InvalidArgCount,
    Exception
  }

  export class CooldownResult extends Result {
    public static fromError(command: Command, cooldown: number, remaining: number): CooldownResult;
    constructor(options: ResultOptions);
  }

  export class ExceptionResult extends Result {
    public static fromError(command: Command, error: Error): ExceptionResult;
    constructor(options: ResultOptions);
  }

  export class Group {
    private static validateGroup(group: Group, name: string): void;
    public readonly name: string;
    public readonly description: string;
    public readonly preconditions: Precondition[];
    public readonly commands: Collection<string, Command>;
    constructor(options: GroupOptions);
  }

  export class Handler {
    public readonly registry: Registry;
    public readonly parser: Parser;
    constructor(registry: Registry);
    public run(message: Message, prefix: string): Promise<Result>;
  }

  export class Parser {
    public parseArgument(command: Command, message: Message, argument: Argument, input: string): Promise<Result>;
    public defaultValue(argument: Argument, message: Message): any;
  }

  export class Precondition {
    public run(command: Command, message: Message): Promise<Result>;
  }

  export class PreconditionResult extends Result {
    public static fromSuccess(): PreconditionResult;
    public static fromError(command: Command, reason: string): PreconditionResult;
    constructor(options: ResultOptions);
  }

  export class Registry {
    public readonly commands: Collection<string, Command>;
    public readonly groups: Collection<string, Group>;
    public readonly typeReaders: Collection<string, TypeReader>;
    public registerDefaultTypeReaders(): Registry;
    public registerTypeReadersIn(path: string): Registry;
    public registerTypeReaders(typeReaders: TypeReader[]): Registry;
    public registerGroupsIn(path: string): Registry;
    public registerGroups(groups: Group[]): Registry;
    public registerCommandsIn(path: string): Registry;
    public registerCommands(commands: Command[]): Registry;
  }

  export class Result {
    public readonly success: boolean;
    public readonly command: Command;
    public readonly commandError: CommandError;
    public readonly errorReason: string;
    public readonly error: Error;
    public readonly value: any;
    public readonly cooldown: number;
    public readonly remaining: number;
    constructor(options: ResultOptions);
  }

  export class TypeReader {
    private static validateTypeReader(typeReader: TypeReader, name: string): void;
    public readonly type: string;
    constructor(options: TypeReaderOptions);
    public read(command: Command, message: Message, argument: Argument, input: string): Promise<Result>;
  }

  export class TypeReaderResult extends Result {
    public static fromSuccess(value: any): TypeReaderResult;
    public static fromError(command: Command, reason: string): TypeReaderResult;
    constructor(options: ResultOptions);
  }

  interface ArgumentOptions {
    name: string;
    key: string;
    type: string;
    example: string;
    argumentDefault: any;
    infinite: boolean;
    remainder: boolean;
    preconditions: ArgumentPrecondition[];
  }

  interface CommandOptions {
    name: string;
    aliases: string[];
    group: string;
    description: string;
    guildOnly: boolean;
    userPermissions: string[];
    botPermissions: string[];
    preconditions: Precondition[];
    args: Argument[];
    coooldown: number;
  }

  interface GroupOptions {
    name: string;
    description: string;
    preconditions: Precondition[];
  }

  interface ResultOptions {
    success: boolean;
    command: Command;
    commandError: CommandError;
    errorReason: string;
    error: Error;
    value: any;
    cooldown: number;
    remaining: number;
  }

  interface TypeReaderOptions {
    type: string;
  }
}
