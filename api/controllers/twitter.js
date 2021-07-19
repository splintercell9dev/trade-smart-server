// controller logic for twitter route

const axios = require('axios').default ;
const logger = require('../utils/logger') ;
const list = require('../json/people.json') ;
const companyList = require('../json/full_company_list.json') ;
const Twitter = axios.create({
    baseURL: 'https://api.twitter.com/2/',
    headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
    }
}) ;

const FetchPostsForSocialFeed = async (req, res) => {
    try{
        const twitter = [] ;

        for(let people of list){
            const result = await Twitter.get(`/users/${people.id}/tweets`, {
                params: {
                    max_results: 5,
                    expansions: 'attachments.media_keys',
                    'tweet.fields': 'attachments,created_at,public_metrics',
                    'media.fields': 'preview_image_url,url'
                }
            }) ;

            const full_postdata = {
                ...people,
                tweets: {
                    data: result.data.data
                }
            } ;

            if (result.data.includes !== undefined){
                full_postdata.tweets.includes = result.data.includes ;
            }
            twitter.push(full_postdata) ;
        }

        res.status(200).json({
            twitter
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

const FetchCompanyPostFeed = async (req, res) => {
    try{
        const symbol = req.query.symbol ;
        let companyIndex = 0 ;

        const twitterExist = companyList.some( (company, index) => {
            companyIndex = index ;
            return company.symbol === symbol && company.twitter !== null ;
        }) ;

        if (!twitterExist){
            // throw CustomException('Company\'s twitter account doesnot exist!', 'invalid') ;
            res.status(200).json({
                code: 200,
                twitter: null
            }) ;
        }
        else{
            const twitterDetails = companyList[companyIndex].twitter ;
            const result = await Twitter.get(`/users/${twitterDetails.id}/tweets`, {
                params: {
                    max_results: 5,
                    expansions: 'attachments.media_keys',
                    'tweet.fields': 'attachments,created_at,public_metrics',
                    'media.fields': 'preview_image_url,url'
                }
            }) ;

            const twitter = {
                ...twitterDetails,
                profile_image_url: companyList[companyIndex].profileImageUrl,
                tweets: {
                    data: result.data.data || []
                }
            }

            if (result.data.includes !== undefined){
                twitter.tweets.includes = result.data.includes ;
            }

            res.status(200).json({
                code: 200,
                twitter: [twitter]
            }) ;
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
}

module.exports = {
    FetchPostsForSocialFeed,
    FetchCompanyPostFeed
} ;