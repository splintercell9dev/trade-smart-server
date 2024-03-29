// controller logic for company routes

const axios = require('axios').default ;
const logger = require('../utils/logger') ;
const { CustomException } = require('../utils/functions') ;
const FullList = require('../json/full_company_list.json') ;
const CompanyModel = require('../models/CompanyModel') ;

const ChartIntervals = [
    {
        interval: '5m',
        range: '1d'
    },
    {
        interval: '5m',
        range: '5d'
    },
    {
        interval: '1d',
        range: '6mo'
    },
    {
        interval: '1d',
        range: '1y'
    },
    {
        interval: '1d',
        range: '5y'
    }
]

// old rapid api (now not working)

// const CompanyInfo = axios.create({
//     baseURL: 'https://yahoo-finance-low-latency.p.rapidapi.com/v11/',
//     headers: {
//         'x-rapidapi-host': 'yahoo-finance-low-latency.p.rapidapi.com',
//         'x-rapidapi-key': process.env.RAPIDAPI_APIKEY2
//     },
//     params: {
//         region: 'IN'
//     }
// }) ;

// const CompanyGraph = axios.create({
//     baseURL: 'https://yahoo-finance-low-latency.p.rapidapi.com/v8/',
//     headers: {
//         'x-rapidapi-host': 'yahoo-finance-low-latency.p.rapidapi.com',
//         'x-rapidapi-key': process.env.RAPIDAPI_APIKEY1
//     },
//     params: {
//         region: 'IN'
//     }
// }) ;


// new yahoo finance api

const CompanyInfo = axios.create({
    baseURL: 'https://yfapi.net/v11',
    headers: {
        'x-api-key': process.env.YAHOOFINANCE_APIKEY
    },
    params: {
        region: 'IN'
    }
}) ;

const CompanyGraph = axios.create({
    baseURL: 'https://yfapi.net/v8',
    headers: {
        'x-api-key': process.env.YAHOOFINANCE_APIKEY
    },
    params: {
        region: 'IN'
    }
}) ;

const FetchSearchResults = async (req, res) => {
    try{
        const queryCompany = req.query.q ;
        
        if (queryCompany === '' || queryCompany === undefined){
            throw CustomException('Requested query must not be empty','invalid') ;
        }

        const searchCompany =  await CompanyModel.find({
            $or: [
                {
                    name: new RegExp(queryCompany, 'i')
                },
                {
                    symbol: new RegExp(queryCompany, 'i')
                }
            ]
        }) ;

        const final_data = searchCompany.map(company => {
            const other_data = FullList.filter(c => c.symbol === company._doc.symbol)[0] ;
            return {
                ...company._doc,
                profileImageUrl: other_data.profileImageUrl
            } ;
        }) ;

        res.status(200).json({
            code: 200,
            list: final_data
        }) ;
    }
    catch(err){
        logger.error(err.stack) ;
        if (err.code === 'invalid'){
            res.status(400).json({
                code: 400,
                message: err.message
            }) ;
        }
        else{
            res.status(500).json({
                code: 500,
                message: 'Error occurred at server side. Please try again later.'
            }) ;
        }
    }
} ;

const FetchFullCompanyDetails = async (req, res) => {
    try{
        const YFSymbol = req.query.symbol ;
        
        if (YFSymbol === '' || !FullList.some( company => company.YFSymbol === YFSymbol)){
            throw CustomException('Requested Symbol is Invalid', 'invalid') ;
        }

        const result = await CompanyInfo.get(`/finance/quoteSummary/${YFSymbol}`, {
            params: {
                modules: 'summaryDetail,assetProfile,incomeStatementHistory,balanceSheetHistory'
            }
        }) ;

        const stock = await CompanyModel.findOne({
            YFSymbol: YFSymbol
        }) ;

        if ( result.data && result.data.quoteSummary.error === null ){
            res.status(200).json({
                code: 200,
                details: {
                    ...result.data.quoteSummary.result[0],
                    stock
                }
            }) ;
        }
        else{
            throw CustomException('Error occurred from API', 'API') ;
        }
    }
    catch(err){
        logger.error(err.stack) ;
        if (err.code === 'invalid'){
            res.status(400).json({
                code: 400,
                message: err.message
            }) ;
        }
        else{
            res.status(500).json({
                code: 500,
                message: 'Error occurred at server side. Please try again later.'
            }) ;
        }
    }
} ;

const FetchCompanyGraph = async (req, res) => {
    try{
        const YFSymbol = req.query.symbol ;
        const range = req.query.range ;
        const selectedInterval = ChartIntervals.filter( val => val.range === range)[0] ;
        
        if (YFSymbol === '' || YFSymbol === undefined){
            throw CustomException('Requested query must not be empty','invalid') ;
        }
        else if (!selectedInterval && range === undefined){
            throw CustomException('Chart range is invalid', 'invalid') ;
        }

        const result = await CompanyGraph.get(`/finance/chart/${YFSymbol}`, {
            params: {
                interval: selectedInterval.interval,
                range: selectedInterval.range
            }
        }) ;

        if ( result.data && result.data.chart.error === null ){
            const { timestamp, indicators } =  result.data.chart.result[0] ;

            res.status(200).json({
                code: 200,
                chart: {
                    range: selectedInterval.range,
                    timestamp,
                    indicators: indicators.quote[0].close
                }
            }) ;
        }
        else{
            throw CustomException('Error occurred from API', 'API') ;
        }
    }
    catch(err){
        logger.error(err.stack) ;
        if (err.code === 'invalid'){
            res.status(400).json({
                code: 400,
                message: err.message
            }) ;
        }
        else{
            res.status(500).json({
                code: 500,
                message: 'Error occurred at server side. Please try again later.'
            }) ;
        }
    }
} ;

module.exports = {
    FetchSearchResults,
    FetchFullCompanyDetails,
    FetchCompanyGraph
} ;