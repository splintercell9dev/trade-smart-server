// news route controllers

const NEWSAPI = require('newsapi') ;
const APIKEY = process.env.NEWSAPI_APIKEY ;
const api = new NEWSAPI(APIKEY) ;

const companies = require('../../new-companies.json') ;

const logger = require('../utils/logger') ;
const { CustomException } = require('../utils/functions') ;

const FetchAllNews = async (req, res) => {
    try{
        const data = await api.v2.topHeadlines({
            category: 'business',
            country: 'in',
            pageSize: 5
        }) ;
        
        res.status(200).json({
            news: data.articles
        }) ;       
    }
    catch(err){
        logger.error(`${err.message}\n${err.stack}`) ;
        res.status(500).json({
            code: 500,
            message: 'Error occurred at server side. Please try again later.'
        }) ;
    }
} ;

const FetchAllNewsRelatedToCompany = async (req, res) => {
    try{
        const queryCompany = req.query.name ;
        console.log(queryCompany);
        if (queryCompany === '' || queryCompany === undefined || !companies.includes({ name: queryCompany })){
            throw CustomException('Not a valid query string', 'invalid') ;
        }

        const data = await api.v2.everything({
            q: queryCompany,
            pageSize: 5
        }) ;

        res.status(200).json({
            news: data.articles
        }) ;
    }
    catch(err){
        res.status(500).json({
            code: 500,
            message: 'Error occurred at server side. Please try again later.'
        }) ;
        
        logger.error(err.stack) ;
    }
} ;

module.exports = {
    FetchAllNews,
    FetchAllNewsRelatedToCompany
} ;