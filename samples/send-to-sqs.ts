const Aws = require('aws-sdk')
const Config = require('./config.json');

const messages = 10

async function main() {
  const sqs = new Aws.SQS(Config)
  for (let i = 0; i < messages; i++) {
    await sqs.sendMessage({
      QueueUrl: Config.queueUrl,
      MessageBody: `{"text":"message ${i}"}`
    }).promise()
  }
  console.log(`${messages} message(s) sent`)
}

main()
