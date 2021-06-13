// file all endpoints required by home page of trade-smart app

const express = require('express') ;
const router = express.Router() ;
const { FetchGraphData, FetchIndexes } = require('../controllers/metrics') ;

router.get('/stockIndices', FetchIndexes) ;

router.get('/graphData', FetchGraphData) ;

module.exports = router ;