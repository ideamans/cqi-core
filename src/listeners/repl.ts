import { Factory, Component, ListenerInterface, CQI, OnMessageCallback } from '../base'
import Readline = require('readline')

// REPL listener

export class ReplListener extends Component implements ListenerInterface {
  async run(onMessage: OnMessageCallback): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const rl = Readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      // rl.on('SIGINT', () => {
      //   this.cqi.logger.debug('caught SIGINT.', 'readline')
      //   rl.close()
      //   resolve()
      // })

      this.cqi.logger.debug('started.', 'readline')

      for(;;) {
        const message: string = await new Promise(resolve => rl.question('Queue Message> ', resolve))
        await onMessage(message)
      }
    })
  }
}

export function register(cqi: CQI) {
  cqi.factory.listeners.register('repl', ReplListener)
}
