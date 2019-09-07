export * from './base'

// Built in plug-ins
import { CQI } from './base'

import * as ArrayListener from './listeners/array'
ArrayListener.register(CQI.instance)

import * as ReplListener from './listeners/repl'
ReplListener.register(CQI.instance)

import * as SqsListener from './listeners/sqs'
SqsListener.register(CQI.instance)

import * as EchoDispatcher from './dispatchers/echo'
EchoDispatcher.register(CQI.instance)

import * as ExecDispatcher from './dispatchers/exec'
ExecDispatcher.register(CQI.instance)

import * as StdioDispatcher from './dispatchers/stdio'
StdioDispatcher.register(CQI.instance)
