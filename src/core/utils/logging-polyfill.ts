import { createCustomLogger } from './logger'

const logger = createCustomLogger('unbound')

console.log = logger.info.bind(logger)
console.error = logger.error.bind(logger)
console.info = logger.info.bind(logger)
console.debug = logger.debug.bind(logger)
console.warn = logger.warn.bind(logger)
