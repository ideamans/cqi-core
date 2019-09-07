import { CQI, LogLevel } from '../src/index'

// Copy and edit config.json.dist as config.json
const Config = require('./config.json')

async function main() {
  const cqi = CQI.instance
  cqi.config.logLevel = LogLevel.Verbose

  const listener = cqi.factory.listeners.create('sqs', {
    region: Config.region,
    queueUrl: Config.queueUrl,
  })
  const dispatcher = cqi.factory.dispatchers.create('echo')

  await cqi.runDefaultContainer(listener, dispatcher)
}

main()