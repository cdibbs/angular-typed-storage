export interface ILogService {
  error(message?: any, ...optional: any[]): void;
  log(message?: any, ...optional: any[]): void;
  warn(message?: any, ...optional: any[]): void;
  info(message?: any, ...optional: any[]): void;
}