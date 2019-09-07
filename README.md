CQI stands for Common Queue Interface, inspired by CGI.

CQI is a simple and extensible framework to develop queue worker application. It listens message from a queue, and dispatch the messages to an another process through the standard I/O.

The following code listens SQS queue, and executes `application.sh` for each message. `application.sh` inputs message body via STDIN, and return the exit code 0 if succeeded.

```javascript
import { CQI } from '../src/index'

const cqi = CQI.instance
const listener = CQI.factory.listeners.create('sqs', {
  region: 'your-region-1', // Your region
  queueUrl: 'https://sqs.your-region-1.amazonaws.com/ACCOUNT/QUEUE', // Your queueu URL
})

const dispatcher = CQI.factory.dispatchers.create('exec', {
  programFilePath: 'application.sh'
})

cqi.runDefaultContainer(listener, dispatcher)
```

# Component Types

## Listener

Listener receive messages from a queue, and passes them to the dispatcher.

* `array` Listener to dispatch smessages as string array. (for debugging)
* `repl` Listener to dispatch message input from console. (for debugging)
* `sqs` Amazon SQS listener.

## Dispatcher

Dispatcher passes a queue message from listener to the processer, and decide if successfully consumed.

* `EchoDispatcher` Only echo the message.
* `ExecDispatcher` CGI style. Starting a new process for each message.
* `StdioDispather` Server style. Single process receives messages as lines from STDIN.

`ExecDispatcher` starts new process for each message, and writes the JSON to STDIN. If the exit status is 0, the message processed successfully.

`StdioDispather` starts a new process at first, and write each message as a JSON line to STDIN. The process outputs blank line if successfully consumed. Not blank line assumed an error message.

## Container

Container joins listener and dispather. There is only one `Container`.
