import Between from '../src/preconditions/Between.js';
import CharacterLimit from '../src/preconditions/CharacterLimit.js'
import Maximum from '../src/preconditions/Maximum.js'
import Minimum from '../src/preconditions/Minimum.js'

declare module 'patron.js' {
  export class Argument {
    private static validateArgument(argument: Argument, name: string): void;
    public name: string;
    public key: string;
    public
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
    public run(command: Command, message: Message, argument: Argument, args: object, value: any): Promise<PreconditionResult>;
  }

  export class Command {
    private static validateCommand(command: Command, name: string): void;
    public names: string[];
    public group: Group;
    public groupName: string;
    public description: string;
    public guildOnly: boolean;
    public dmOnly: boolean;
    public memberPermissions: string[];
    public botPermissions: string[];
    public preconditions: Precondition[];
    public args: Argument[];
    public coooldown: number;
    public hasCooldown: boolean;
    private cooldowns: Map<string, number>;
    constructor(options: CommandOptions);
    public run(message: Message, args: object): Promise<any>;
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
    Exception
  }

  export class CooldownResult extends Result {
    public static fromError(command: Command, cooldown: number, remaining: number): CooldownResult;
    private constructor(options: CooldownResultOptions);
  }

  export class ExceptionResult extends Result {
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
    constructor(registry: Registry);
    public run(message: Message, prefix: string): Promise<Result | CooldownResult | ExceptionResult | PreconditionResult | TypeReaderResult>;
  }

  export class LibraryHandler {
    public library: string;
    constructor(options: LibraryHandlerOptions);
    public validatePermissions(message: Message, command: Command);
  }

  export class Precondition {
    public run(command: Command, message: Message): Promise<PreconditionResult>;
  }

  export class PreconditionResult extends Result {
    public static fromSuccess(): PreconditionResult;
    public static fromError(command: Command, reason: string): PreconditionResult;
    private constructor(options: ResultOptions);
  }

  export const preconditions: preconditions;

  export class Registry {
    public library: string;
    public libraryHandler: LibraryHandler;
    public commands: Command[];
    public groups: Group[];
    public typeReaders: TypeReader[];
    constructor(options: RegistryOptions);
    public registerDefaultTypeReaders(): Registry;
    public registerTypeReadersIn(path: string): Registry;
    public registerTypeReaders(typeReaders: TypeReader[]): Registry;
    public registerGroupsIn(path: string): Registry;
    public registerGroups(groups: Group[]): Registry;
    public registerCommandsIn(path: string): Registry;
    public registerCommands(commands: Command[]): Registry;
    private static validateRegistry(registry: Registry): void;
  }

  export class Result {
    public success: boolean;
    public command: Command;
    public commandError: CommandError;
    public errorReason: string;
    constructor(options: ResultOptions);
  }

  export class TypeReader {
    private static validateTypeReader(typeReader: TypeReader, name: string): void;
    public type: string;
    constructor(options: TypeReaderOptions);
    public read(command: Command, message: Message, argument: Argument, args: object, input: string): Promise<TypeReaderResult>;
  }

  export class TypeReaderResult extends Result {
    public static fromSuccess(value: any): TypeReaderResult;
    public static fromError(command: Command, reason: string): TypeReaderResult;
    private constructor(options: TypeReaderResultOptions);
  }

  interface ArgumentOptions {
    name: string;
    key: string;
    type: string;
    example: string;
    defaultValue: any;
    infinite: boolean;
    remainder: boolean;
    preconditions: ArgumentPrecondition[];
  }

  interface CommandOptions {
    names: string[];
    groupName: string;
    description: string;
    guildOnly: boolean;
    dmOnly: boolean;
    userPermissions: string[];
    botPermissions: string[];
    preconditions: Precondition[];
    args: Argument[];
    cooldown: number;
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
    description: string;
    preconditions: Precondition[];
  }

  interface preconditions {
    Administrator: Precondition;
    Between: typeof Between;
    CharacterLimit: typeof CharacterLimit;
    Maximum: typeof Maximum;
    Minimum: typeof Minimum;
    Moderator: Precondition;
    NoSelf: ArgumentPrecondition;
    NSFW: Precondition;
    Owner: Precondition;
  }

  interface ResultOptions {
    success: boolean;
    command: Command;
    commandError: CommandError;
    errorReason: string;
  }

  interface TypeReaderOptions {
    type: string;
  }

  interface RegistryOptions {
    library: string?;
  }

  interface LibraryHandlerOptions {
    library: string;
  }

  interface TypeReaderResultOptions extends ResultOptions {
    value: any;
  }
}
