import { Factory, Component, DispatcherInterface, CQI } from '../base'

export class EchoDispatcher extends Component implements DispatcherInterface {
  async start(): Promise<void> {}
  async stop(): Promise<void> {}

  async dispatch(message: string): Promise<boolean> {
    this.cqi.logger.info(`Dispathcer received: ${message}`)
    return true
  }
}

export function register(cqi: CQI) {
  cqi.factory.dispatchers.register('echo', EchoDispatcher)
}
