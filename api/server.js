const express = require('express') ;
const server = express() ;
const mongoose = require('mongoose') ;
const morgan = require('morgan') ;
const cors = require('cors') ;
require('dotenv/config') ;

const host = process.env.HOST ;
const port = process.env.PORT ;
const db_url = process.env.DB_URL ;

const logger = require('./utils/logger') ;
const RootRoute = require('./routes/index') ;

server.use(express.json()) ;
server.use(express.urlencoded({ extended: true })) ;
server.use(morgan('short', { stream: logger.stream })) ;
server.use(cors()) ;

(async () => {
    try{
        await mongoose.connect(db_url, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }) ;
    
        logger.info('connection success to database')
    }
    catch(err){
        logger.error('connection failed') ;
    }
})() ;

server.use('/api/v1/', RootRoute) ;

server.get('*', (req, res) => {
    res.status(404).json({
        code: 404,
        message: 'The route you are trying to request is not available.'
    }) ;
}) ;

process.on('SIGINT', async () => {
    await mongoose.disconnect() ;
    logger.info('Closed db connection on exit');
    process.exit() ;
}) ;

process.on('beforeExit', async () => {
    await mongoose.disconnect() ;
}) ;

server.listen(port, host, () => {
    logger.info(`Listening at http://${host}:${port}`);
}) ;