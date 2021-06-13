// controller logic for home routes
const { StaticMetricModel, LiveMetricModel } = require('../models/MetricModel') ;
const logger = require('../utils/logger') ;

const FetchIndexes = async function(req, res){
    try{
        const data = await StaticMetricModel.find() ;
        res.status(200).json(data) ;
    }
    catch(err){
        logger.error(err.stack) ;
    }
} ;

const FetchGraphData = async function(req, res){
    try{
        const data = await LiveMetricModel.find() ;
        res.status(200).json(data) ;
    }
    catch(err){
        logger.error(err.stack) ;
    }
} ;

module.exports = {
    FetchIndexes,
    FetchGraphData
} ;