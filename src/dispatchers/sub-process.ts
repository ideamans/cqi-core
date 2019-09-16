import Path = require('path')
import Execa = require('execa')
import { Component, DispatcherInterface } from '../base'

export abstract class SubProcessDispatcher extends Component implements DispatcherInterface {
  programPath: string
  programArgs: Array<string>
  timeout: number

  constructor(options: Component) {
    super(options)
    this.programPath = options.programPath || ''
    this.programArgs = options.programArgs || []
    this.timeout = options.timeout || 30 * 1000
  }

  programFileBasename(): string {
    return Path.basename(this.programPath)
  }

  execa(options: any={}) {
    return Execa(this.programPath, this.programArgs, {
      stdin: 'pipe',
      stdout: 'pipe',
      stderr: 'pipe',
      ...this,
      ...options,
    })
  }

  async start(): Promise<void> {}
  async stop(): Promise<void> {}

  abstract dispatch(message: string): Promise<boolean>
}

