// this file is for creating loggers for both dev and prod environments

const winston = require('winston') ;
const { transports, format } = winston ;
const { combine, colorize, timestamp, errors, printf } = format ;

const logFormat = printf( ({level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${ stack || message }` ;
}) ;

const devLogger = winston.createLogger({
    format: combine(
        colorize(),
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        errors({
            stack: true
        }),
        logFormat
    ),
    transports: [
        new transports.Console()
    ]
}) ;

const prodLogger = winston.createLogger({
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        errors({
            stack: true
        }),
        logFormat
    ),
    transports: [
        new transports.File({
            dirname: 'logs',
            filename: 'server-error.log',
            maxsize: 5242880,
            level: 'error'
        }),
        new transports.Console({
            level: 'info'
        })
    ]
}) ;

devLogger.stream = {
    write: function(message, encoding){
        logger.info(message) ;
    }    
} ;

prodLogger.stream = {
    write: function(message, encoding){
        logger.info(message) ;
    }    
} ;

let logger ;

if (process.env.NODE_ENV === 'development'){
    logger = devLogger ;
}
else{
    logger = prodLogger ;
}

module.exports = logger ;

