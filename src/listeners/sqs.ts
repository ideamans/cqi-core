import { Factory, Component, CQI, ListenerInterface, OnMessageCallback } from '../base'
import Aws = require('aws-sdk')
import SqsConsumer = require('sqs-consumer')
import Util = require('util')

export class SqsListener extends Component implements ListenerInterface {
  options: any
  constructor(options: Component) {
    super(options)
    this.options = options || {}
  }

  async run(onMessage: OnMessageCallback): Promise<void> {
    return new Promise((resolve, reject) => {
      const sqs = new Aws.SQS(this.options)

      const consumer = SqsConsumer.Consumer.create({
        ...this.options,
        sqs,
        handleMessageBatch: async(messages: any) => {
          this.cqi.logger.debug('received messages: ' + Util.inspect(messages, false, 10), 'sqs-consumer')
          for (let message of messages) {
            await onMessage(message.Body)
          }
        }
      })
  
      consumer.on('error', (err: any) => {
        reject(err)
      })
  
      consumer.on('processing_error', (err: any) => {
        reject(err)
      })
  
      consumer.on('timeout_error', (err: any) => {
        reject(err)
      })
  
      consumer.on('stop', () => {
        this.cqi.logger.debug('stopped.', 'sqs-consumer')
        resolve()
      })
  
      consumer.start()
      this.cqi.logger.debug('started.', 'sqs-consumer')
    })
  }
}

export function register(cqi: CQI) {
  cqi.factory.listeners.register('sqs', SqsListener)
}
