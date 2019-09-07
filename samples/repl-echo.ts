import { CQI, LogLevel } from '../src/index'

async function main() {
  const cqi = CQI.instance
  cqi.config.logLevel = LogLevel.Verbose
  cqi.config.jsonic = true

  const listener = cqi.factory.listeners.create('repl')
  const dispatcher = cqi.factory.dispatchers.create('echo')

  await cqi.runDefaultContainer(listener, dispatcher)
}

main()