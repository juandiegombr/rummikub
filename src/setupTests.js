import { jest } from '@jest/globals'

import { Logger } from './services/logger'

Logger.send = jest.fn()
