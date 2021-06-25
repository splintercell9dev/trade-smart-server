// controller logic for twitter route

const axios = require('axios').default ;
const logger = require('../utils/logger') ;
const list = require('../json/people.json') ;
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

module.exports = {
    FetchPostsForSocialFeed
} ;