const { createLogger, format, transports } = require('winston');

const path = module.filename.split('/').slice(-2).join('/');

module.exports = createLogger({
  level: 'info',
  format: format.combine(
    format.simple(),
    format.timestamp(),
    format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`,
    ),
    format.colorize(),
    format.prettyPrint(),
    format.splat(),
  ),
  transports: [
    new transports.File({
      maxsize: 5120000,
      maxFiles: 5,
      filename: `${__dirname}/../logs/log-api.log`,
    }),
    new transports.Console({
      colorize: true,
      level: 'debug',
      label: path,
    }),
  ],
});
