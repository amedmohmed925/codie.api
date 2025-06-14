const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: path.join(__dirname, '../logs/error.log'), level: 'error' }),
    new transports.Console()
  ]
});

module.exports = logger;
