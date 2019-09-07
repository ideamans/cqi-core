import { Factory, Component, ListenerInterface, CQI, OnMessageCallback } from '../base'
import Readline = require('readline')

// REPL listener

export class ArrayListener extends Component implements ListenerInterface {
  messages: string[]

  constructor(options: Component) {
    super(options)
    this.messages = options.messages || []
  }

  async run(onMessage: OnMessageCallback): Promise<void> {
    for (let message of this.messages) {
      await onMessage(message)
    }
  }
}

export function register(cqi: CQI) {
  cqi.factory.listeners.register('array', ArrayListener)
}
