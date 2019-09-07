import { CQI, LogLevel } from '../src/index'

async function main() {
  const cqi = CQI.instance
  cqi.config.logLevel = LogLevel.Verbose
  cqi.config.jsonic = true

  const listener = cqi.factory.listeners.create('array', {
    messages: [...Array(10).keys()].map(i => `{"text":"message ${i}"}`)
  })
  const dispatcher = cqi.factory.dispatchers.create('echo')

  cqi.runDefaultContainer(listener, dispatcher)
}

main()