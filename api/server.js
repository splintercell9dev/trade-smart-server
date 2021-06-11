const express = require('express') ;
const server = express() ;

server.use(express.json()) ;
server.use(express.urlencoded({ extended: true })) ;

server.get('/', (req, res) => {
    res.status(200).json({
        code: 200,
        message: 'Welcome to dummy API.'
    }) ;
})

server.get('*', (req, res) => {
    res.status(404).json({
        code: 404,
        message: 'The route you are trying to request is not available.'
    }) ;
})

server.listen(3000, () => {
    console.log(`Listening at http://localhost:${3000}`);
}) ;