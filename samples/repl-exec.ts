import { CQI, LogLevel } from '../src/index'
import Path = require('path')

async function main() {
  const cqi = CQI.instance
  cqi.config.logLevel = LogLevel.Verbose
  cqi.config.jsonic = true

  const listener = cqi.factory.listeners.create('repl')
  const dispatcher = cqi.factory.dispatchers.create('exec', {
    programPath: Path.join(__dirname, 'exec.sh')
  })

  await cqi.runDefaultContainer(listener, dispatcher)
}

main()