// controller logic for metrics routes
const { StaticMetricModel, LiveMetricModel } = require('../models/MetricModel') ;
const logger = require('../utils/logger') ;

// function for getting scraped indexes from mongodb
const FetchIndexes = async function(req, res){
    try{
        const data = await StaticMetricModel.find() ;
        res.status(200).json({
            code: 200,
            metrics: {
                lastUpdated: data[0].updatedAt,
                data: data
            }
        }) ;
    }
    catch(err){
        logger.error(err.stack) ;
        res.status(500).json({
            code: 500,
            message: 'Error occurred at server side. Please try again later.'
        }) ;
    }
} ;

// function for getting scraped graph data from mongodb
const FetchGraphData = async function(req, res){
    try{
        const data = await LiveMetricModel.find() ;
        res.status(200).json({
            code: 200,
            metrics: {
                data: data
            }
        }) ;
    }
    catch(err){
        logger.error(err.stack) ;
        res.status(500).json({
            code: 500,
            message: 'Error occurred at server side. Please try again later.'
        }) ;
    }
} ;

module.exports = {
    FetchIndexes,
    FetchGraphData
} ;