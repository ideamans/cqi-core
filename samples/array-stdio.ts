import { CQI, LogLevel } from '../src/index'
import Path = require('path')

async function main() {
  const cqi = CQI.instance
  cqi.config.logLevel = LogLevel.Verbose
  cqi.config.jsonic = true

  const listener = cqi.factory.listeners.create('array', {
    messages: [...Array(1000).keys()].map(i => `{"text":"m ${i}"}`)
  })
  const dispatcher = cqi.factory.dispatchers.create('stdio', {
    programFilePath: Path.join(__dirname, 'stdio.pl'),
    maxBuffer: 10,
  })

  cqi.runDefaultContainer(listener, dispatcher)
}

main()