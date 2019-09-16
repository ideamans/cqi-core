import { Factory, CQI } from '../base'
import { SubProcessDispatcher } from './sub-process'
const { LineTransform } = require('node-line-reader')

export class StdioDispatcher extends SubProcessDispatcher {
  proc?: any

  async start(): Promise<void> {
    this.cqi.logger.debug(`starting ${this.programFilePath} with ` + this.programArgs.map(arg => `"${arg}"`).join(' '), 'execa')

    // Start new process and STDERR log as info
    this.proc = this.execa({ timeout: 0 })

    // STDIN and STDOUT required
    if (!this.proc.stdin) throw new Error('STDIN not opened')
    if (!this.proc.stdout) throw new Error('STDOUT not opened')

    if (this.proc.stderr) {
      const transformErr = new LineTransform()
      this.proc.stderr.pipe(transformErr)
      transformErr.on('data', (line: string) => {
        this.cqi.logger.info('stderr: ' + line, this.programFileBasename())
      })
    }
  }

  async stop(): Promise<void> {
    // End stdin stream to quit process
    if (this.proc.stdin) this.proc.stdin.end()
  }

  async dispatch(message: string): Promise<boolean> {
    if (!this.proc.stdout) throw new Error('STDOUT is blank')
    return new Promise((resolve, reject) => {
      // Flush current buffer
      this.proc.stdout.read()

      // Read data once
      this.proc.stdout.once('readable', () => {
        const data = this.proc.stdout.read()
        const result = data.toString().replace(/\r?\n+$/, '')
        if (result == '') {
          // Blank STDOUT means success
          this.cqi.logger.debug(`processed: ${message}`, this.programFileBasename())
          resolve(true)
        } else {
          // Some STDOUT menas error
          this.cqi.logger.error(result, this.programFileBasename())
          resolve(false)
        }
      })

      // Send message with new line via STDIN
      this.cqi.logger.debug(`stdin: ${message}`, this.programFileBasename())
      this.proc.stdin.write(message + "\n")
    })
  }
}

export function register(cqi: CQI) {
  cqi.factory.dispatchers.register('stdio', StdioDispatcher)
}
