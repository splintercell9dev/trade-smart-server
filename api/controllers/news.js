// controller logic for news route 

const NEWSAPI = require('newsapi') ;
const APIKEY = process.env.NEWSAPI_APIKEY ;
const api = new NEWSAPI(APIKEY) ;
const vader = require('vader-sentiment') ;
const companies = require('../json/new-companies.json') ;

const logger = require('../utils/logger') ;
const { CustomException } = require('../utils/functions') ;

// function for fetching all national news related to business for social section
const FetchAllNews = async (req, res) => {
    try{
        const data = await api.v2.topHeadlines({
            category: 'business',
            country: 'in',
            pageSize: 10
        }) ;
        
        res.status(200).json({
            code: 200,
            news: data.articles.map( article => {
                const input = article.title ;
                const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input) ;
                let result ;

                if ( intensity.neg > intensity.neu && intensity.neg > intensity.pos ){
                    result = 'negative' ;
                }
                else if ( intensity.neu > intensity.neg && intensity.neu > intensity.pos ){
                    result = 'neutral' ;
                }
                else{
                    result = 'positive' ;
                }

                return {
                    ...article,
                    sentiment: result
                } ;
            })
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

// function for fetching news related to particular company
const FetchAllNewsRelatedToCompany = async (req, res) => {
    try{
        const queryCompany = req.query.name ;
        console.log(queryCompany)
        if (queryCompany === undefined || !companies.some(company => company.name === queryCompany)){
            throw CustomException('Query params either not provided or are invalid.', 'invalid') ;
        }

        const data = await api.v2.everything({
            q: queryCompany,
            pageSize: 5
        }) ;

        res.status(200).json({
            code: 200,
            news: data.articles.map( article => {
                const input = article.title ;
                const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input) ;
                let result ;

                if ( intensity.neg > intensity.neu && intensity.neg > intensity.pos ){
                    result = 'negative' ;
                }
                else if ( intensity.neu > intensity.neg && intensity.neu > intensity.pos ){
                    result = 'neutral' ;
                }
                else{
                    result = 'positive' ;
                }

                return {
                    ...article,
                    sentiment: result
                } ;
            })
        }) ;
    }
    catch(err){
        logger.error(err.stack) ;
        res.status(err.code === 'invalid' ? 400 : 500).json({
            code: err.code === 'invalid' ? 400 : 500,
            message: err.code === 'invalid' ? err.message : 'Error occurred at server side. Please try again later.'
        }) ;
    }
} ;

module.exports = {
    FetchAllNews,
    FetchAllNewsRelatedToCompany
} ;