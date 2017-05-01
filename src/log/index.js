var log4js = require('log4js');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('src/data/logs.log'));
logger.setLevel('ERROR');