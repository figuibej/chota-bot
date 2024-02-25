'use strict'

const logger = require('pino');

module.exports = {
    LOGGER: logger(
        {
            level: 'debug',
            transport: {
                target: 'pino-pretty'
            }
        }
    )
}