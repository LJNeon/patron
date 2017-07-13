declare module 'patron.js' {
  import { Message, Collection, GuildMember, User } from 'discord.js';

  export class Argument {
    constructor(options: ArgumentOptions);
    public readonly name : string;
    public readonly key : string;
    public readonly type : TypeReader;
    public readonly example: string;
    public readonly default: any;
    public readonly infinite: boolean;
    public readonly preconditions: Array<ArgumentPrecondition>;
    public readonly remainder: boolean;
    public readonly optional: boolean;
    private static validateArgument(argument: Argument, name: string): void;
  }

  export class ArgumentPrecondition {
    public run(command: Command, message: Message, argument: Argument, value: any): Promise<Result>;
  }

  export class Command {
    constructor(options: CommandOptions);
    public readonly name: string;
    public readonly aliases: Array<string>;
    public readonly group: Group;
    public readonly description: string;
    public readonly guildOnly: boolean;
    public readonly userPermissions: Array<string>;
    public readonly botPermissions: Array<string>;
    public readonly preconditions: Array<Precondition>;
    public readonly args: Array<Argument>;
    public readonly coooldown: number;
    public readonly hasCooldown: Boolean;
    private _cooldowns: Collection<string, number>;
    public trigger: string;
    public run(message: Message, args: Array<Argument>): Promise<any>;
    public getUsage(): string;
    public getExample(): string;
    private static validateCommand(command: Command, name: string): void;
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
    constructor(options: ResultOptions);
    public static fromError(command: Command, cooldown: number, remaining: number): CooldownResult;
  }

  export enum Default {
    Author,
    Member,
    Channel,
    Guild,
    HighestRole
  }

  export class ExceptionResult extends Result {
    constructor(options: ResultOptions);
    public static fromError(command: Command, error: Error): ExceptionResult;
  }

  export class Group {
    constructor(options: GroupOptions);
    public readonly name: string;
    public readonly description: string;
    public readonly preconditions: Array<Precondition>;
    public readonly commands: Collection<string, Command>;
    private static validateGroup(group: Group, name: string): void;
  }

  export class Handler {
    constructor(registry: Registry);
    public readonly registry: Registry;
    public readonly parser: Parser;
    public run(message: Message, prefix: string): Promise<Result>;
  }

  export class Parser {
    public parseArgument(command: Command, argument: Argument, message: Message, input: string): Promise<Result>;
    public defaultValue(argument: Argument, message: Message): any;
  }

  export class PermissionUtil {
    public static format(permission: Array<string>): string;
  }

  export class Precondition {
    public run(command: Command, message: Message): Promise<Result>;
  }

  export class PreconditionResult extends Result {
    constructor(options: ResultOptions);
    public static fromSuccess(): PreconditionResult;
    public static fromError(command: Command, reason: string): PreconditionResult;
  }

  export class Registry {
    public readonly commands: Collection<string, Command>;
    public readonly groups: Collection<string, Group>;
    public readonly typeReaders: Collection<string, TypeReader>;
    public registerDefaultTypeReaders(): Registry;
    public registerTypeReadersIn(path: string): Registry;
    public registerTypeReaders(typeReaders: Array<TypeReader>): Registry;
    public registerGroupsIn(path: string): Registry;
    public registerGroups(groups: Array<Group>): Registry;
    public registerCommandsIn(path: string): Registry;
    public registerCommands(commands: Array<Command>): Registry;
  }

  export class Result {
    constructor(options: ResultOptions);
    public readonly success: boolean;
    public readonly command: Command;
    public readonly commandError: CommandError
    public readonly errorReason: string;
    public readonly error: Error;
    public readonly value: any;
    public readonly cooldown: number;
    public readonly remaining: number;
  }

  export class StringUtil {
    public static upperFirstChar(input: string): string;
  }

  export class TypeReader {
    constructor(options: TypeReaderOptions);
    public readonly type: string;
    public read(command: Command, message: Message, argument: Argument, input: string): Promise<Result>;
    private static validateTypeReader(typeReader: TypeReader, name: string): void;
  }

  export class TypeReaderResult extends Result {
    constructor(options: ResultOptions);
    public static fromSuccess(value: any): TypeReaderResult;
    public static fromError(command: Command, reason: string): TypeReaderResult;
  }

  export class TypeReaderUtil {
    public static formatMembers(members: GuildMember): string;
    public static formatUsers(users: User): string;
    public static formatNameables(nameables: Array<any>): string;
  }

  type ArgumentOptions = {
    name: string,
    key: string,
    type: string,
    example: string,
    default: any,
    infinite: boolean,
    remainder: boolean,
    preconditions: Array<ArgumentPrecondition>
  }

  type CommandOptions = {
    name: string,
    aliases: Array<string>,
    group: string,
    description: string,
    guildOnly: boolean,
    userPermissions: Array<string>,
    botPermissions: Array<string>,
    preconditions: Array<Precondition>,
    args: Array<Argument>,
    coooldown: number
  }

  type GroupOptions = {
    name: string,
    description: string,
    preconditions: Array<Precondition>
  }

  type ResultOptions = {
    success: boolean,
    command: Command,
    commandError: CommandError,
    errorReason: string,
    error: Error,
    value: any,
    cooldown: number,
    remaining: number
  }

  type TypeReaderOptions = {
    type: string
  }
}
