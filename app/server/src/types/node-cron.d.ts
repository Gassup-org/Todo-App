declare module 'node-cron' {
  export interface ScheduledTask {
    start(): void;
    stop(): void;
  }

  export function schedule(expression: string, func: () => void | Promise<void>): ScheduledTask;
}
