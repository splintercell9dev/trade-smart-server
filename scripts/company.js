const axios = require('axios').default ;
require('dotenv/config') ;

const companies = require('../api/json/new-companies.json') ;

const CompanyInfo = axios.create({
    baseURL: 'https://yahoo-finance-low-latency.p.rapidapi.com/v11/',
    headers: {
        'x-rapidapi-host': 'yahoo-finance-low-latency.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_APIKEY1
    },
    params: {
        region: 'IN'
    }
}) ;

const CompanyGraph = axios.create({
    baseURL: 'https://yahoo-finance-low-latency.p.rapidapi.com/v11/',
    headers: {
        'x-rapidapi-host': 'yahoo-finance-low-latency.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_APIKEY2
    }
}) ;

async function getlistInfo(x){
    try{
        const data = await CompanyInfo.get('/finance/quoteSummary', {
            params: {
                modules: '',
                symbol: x
            }
        })
    }
    catch(err){
        console.log(err.stack);
    }
}