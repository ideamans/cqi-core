import Path = require('path')
import Execa = require('execa')
import { Component, DispatcherInterface } from '../base'

export abstract class SubProcessDispatcher extends Component implements DispatcherInterface {
  programFilePath: string
  programArgs: Array<string>
  timeout: number

  constructor(options: Component) {
    super(options)
    this.programFilePath = options.programFilePath || ''
    this.programArgs = options.programArgs || []
    this.timeout = options.timeout || 30 * 1000
  }

  programFileBasename(): string {
    return Path.basename(this.programFilePath)
  }

  execa(options: any={}) {
    return Execa(this.programFilePath, this.programArgs, {
      stdin: 'pipe',
      stdout: 'pipe',
      stderr: 'pipe',
      ...options,
    })
  }

  async start(): Promise<void> {}
  async stop(): Promise<void> {}

  abstract dispatch(message: string): Promise<boolean>
}

