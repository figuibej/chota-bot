'use strict'

const logger = require('pino');

module.exports = {
    LOGGER: logger(
        {
            level: 'info',
            transport: {
                target: 'pino-pretty'
            }
        }
    )
}