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
    public static fromSuccess(command?: Command): Result;
    private constructor(options: ResultOptions);
  }

  export class ArgumentResult extends Result {
    public args: object;
    public static fromInvalidCount(command: Command): Result;
    public static fromSuccess(command: Command, args: object): ArgumentResult;
    private constructor(options: ArgumentResultOptions);
  }

  export class CommandResult extends Result {
    public data: any;
    public static fromError(reason: string, data: any): CommandResult;
    public static fromUnknown(commandName: string): Result;
    private setCommand(command: Command): void;
    private constructor(options: CommandResultOptions);
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

  export class InvalidContextResult extends Result {
    public context: Symbol;
    public static fromError(command: Command, context: Symbol): InvalidContextResult;
    private constructor(options: InvalidContextResultOptions);
  }

  export class PermissionResult extends Result {
    public permissions: string[];
    public static format(permissions: string[]): string;
    public static fromBot(command: Command, permissions: string[]): PermissionResult;
    public static fromMember(command: Command, permissions: string[]): PermissionResult;
    private constructor(options: PermissionResultOptions);
  }

  export class PreconditionResult extends Result {
    public static fromSuccess(): PreconditionResult;
    public static fromError(command: Command, reason: string): PreconditionResult;
  }

  export class TypeReaderResult extends Result {
    public matches?: object[];
    public value: any;
    public static fromError(command: Command, reason: string, matches?: object[]): TypeReaderResult;
    public static fromSuccess(value: any): TypeReaderResult;
    constructor(options: TypeReaderResultOptions);
  }

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
}
