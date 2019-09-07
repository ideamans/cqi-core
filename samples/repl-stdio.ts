import { CQI, LogLevel } from '../src/index'
import Path = require('path')

async function main() {
  const cqi = CQI.instance
  cqi.config.logLevel = LogLevel.Verbose

  const listener = cqi.factory.listeners.create('repl')
  const dispatcher = cqi.factory.dispatchers.create('stdio', {
    programFilePath: Path.join(__dirname, 'stdio.pl')
  })

  await cqi.runDefaultContainer(listener, dispatcher)
}

main()