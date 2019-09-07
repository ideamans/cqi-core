const Jsonic = require('jsonic')

// Enums

export enum LogLevel {
  Verbose = 'verbose',
  Normal = 'normal',
  Quiet = 'quiet',
}

export enum TerminalColor {
  Red = '\u001b[31m',
  Green = '\u001b[32m',
  Magenta = '\u001b[35m',
  Cyan = '\u001b[36m',
  Reset = '\u001b[0m',
}

export type OnMessageCallback = (message: string) => Promise<boolean>

// Interfaces

export interface LoggerInterface {
  debug(message: string, source?: string): void
  info(message: string, source?: string): void
  error(err: any, source?: string): void
}

export interface ListenerInterface {
  run(onMessage: OnMessageCallback): Promise<void>
}

export interface DispatcherInterface {
  start(): Promise<void>
  stop(): Promise<void>
  dispatch(message: string): Promise<boolean>
}

export interface ContainerInterface {
  run(): Promise<void>
}

export class CQI {
  factory: {
    loggers: Factory<LoggerInterface>,
    listeners: Factory<ListenerInterface>,
    dispatchers: Factory<DispatcherInterface>,
    containers: Factory<ContainerInterface,Container>,
  } = {
    loggers: new Factory<LoggerInterface>(this),
    listeners: new Factory<ListenerInterface>(this),
    dispatchers: new Factory<DispatcherInterface>(this),
    containers: new Factory<ContainerInterface,Container>(this),
  }

  readonly config = {
    jsonic: false,
    logLevel: LogLevel.Normal,
  }

  logger: LoggerInterface

  private constructor() {
    this.logger = new Logger({cqi: this})
    this.factory.loggers.register('default', Logger)
    this.factory.containers.register('default', Container)
  }

  static _instance: CQI

  static get instance() {
    if (!this._instance) this._instance = new this()
    return this._instance
  }

  async runDefaultContainer(listener: ListenerInterface, dispatcher: DispatcherInterface) {
    const container = this.factory.containers.create('default', { listener, dispatcher })
    await container.run()
  }
}

export class Component {
  cqi: CQI
  [prop: string]: any
  constructor(options: Component) {
    this.cqi = options.cqi
  }
}

// Factory class for component aliasing
export class Factory<I,T=Component> {
  cqi: CQI
  types: {
    [key: string]: { new(options: T): I }
  } = {}

  constructor(cqi: CQI) {
    this.cqi = cqi
  }

  register(name: string, type: { new(options: T): I }) {
    this.types[name] = type
  }

  create(name: string, options: any={}): I {
    const type = this.types[name]
    return new type({
      ...options,
      cqi: this.cqi
    })
  }
}

export class Logger extends Component implements LoggerInterface {
  printLine(line: string) {
    process.stderr.write(line.replace(/[\s\n]+$/m, '') + "\n")
  }

  printColoredLine(message: string, color: TerminalColor) {
    this.printLine(color + message + TerminalColor.Reset)
  }

  printLogFormat(level: string, message: string, source?: string, color?: TerminalColor) {
    if (source) message = `<${source}> ${message}`
    const line = `[${new Date().toISOString()}] ${level} - ${message}`
    if (color) this.printColoredLine(line, color)
    else this.printLine(line)
  }

  debug(message: string, source?: string): void {
    if (this.cqi.config.logLevel != LogLevel.Verbose) return // Skip if not verbose
    this.printLogFormat('debug', message, source, TerminalColor.Cyan)
  }

  info(message: string, source?: string): void {
    if (this.cqi.config.logLevel == LogLevel.Quiet) return // Skip if quiet
    this.printLogFormat('info', message, source)
  }

  error(err: any, source?: string): void {
    if (this.cqi.config.logLevel == LogLevel.Quiet) return // Skip if quiet
    let message: string
    if (this.cqi.config.logLevel == LogLevel.Verbose) message = err.stack ? err.stack : err.toString()
    else message = err.message ? err.message.replace(/\n/g, '') : err.toString()
    this.printLogFormat('error', message, source, TerminalColor.Red)
  }
}

// Listener

// Dispatcher

// Container

export class Container extends Component implements ContainerInterface {
  listener: ListenerInterface
  dispatcher: DispatcherInterface

  constructor(options: Container) {
    super(options)
    this.listener = options.listener
    this.dispatcher = options.dispatcher
  }

  async init(): Promise<void> {}

  async run(): Promise<void> {
    await this.dispatcher.start()

    await this.listener.run(async (message: string) => {
      this.cqi.logger.debug(message, 'onMessage')

      const normalizer = this.cqi.config.jsonic ? Jsonic : JSON.parse
      const format = this.cqi.config.jsonic ? 'jsonic' : 'JSON'
      try {
        const obj = normalizer(message)
        message = JSON.stringify(obj)
      } catch(ex) {
        this.cqi.logger.error(`Failed to parse as ${format}: ${message} (${ex.message})`)
        return true
      }

      return await this.dispatcher.dispatch(message)
    })

    await this.dispatcher.stop()
  }
}
