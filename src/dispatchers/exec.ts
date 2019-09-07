import { Factory, CQI } from '../base'
import { SubProcessDispatcher } from './sub-process'
const { LineTransform } = require('node-line-reader')

export class ExecDispatcher extends SubProcessDispatcher {
  async dispatch(message: string): Promise<boolean> {
    this.cqi.logger.debug(`starting ${this.programFilePath} with ` + this.programArgs.map(arg => `"${arg}"`).join(' '), 'execa')

    const proc = this.execa({ timeout: this.timeout })

    // STDOUT, STDERR log as info
    if (proc.stdout) {
      const transformOut = new LineTransform()
      proc.stdout.pipe(transformOut)
      transformOut.on('data', (line: string) => {
        this.cqi.logger.info('stdout: ' + line, this.programFileBasename())
      })
    }

    if (proc.stderr) {
      const transformErr = new LineTransform()
      proc.stderr.pipe(transformErr)
      transformErr.on('data', (line: string) => {
        this.cqi.logger.info('stderr: ' + line, this.programFileBasename())
      })
    }

    // Write message
    if (proc.stdin) {
      this.cqi.logger.info('stdin: ' + message, this.programFileBasename())
      proc.stdin.end(message)
    }

    try {
      await proc

      // Execa assums exit=0 as successfully
      return true
    } catch(ex) {
      // exit!=0 or timed out
      this.cqi.logger.error(ex, this.programFileBasename())
      return false
    }

  }
}

export function register(cqi: CQI) {
  cqi.factory.dispatchers.register('exec', ExecDispatcher)
}
