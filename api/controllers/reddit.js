// controller logic for reddit route

const Reddit = require('snoowrap') ;

// excluding some tags fetched by api
const excludedTags = [
    "Meme",
    "Daily Discussion"
] ;

const api = new Reddit({
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
    clientId: process.env.REDDIT_CLIENTID,
    clientSecret: process.env.REDDIT_CLIENTSECRET,
    userAgent: `trade-smart v1.0.0 by /u/splintercell9dev`
}) ;

// function to fetch 10 posts from r/wallstreetbets with some filters
const FetchPostsOnWallStreetBets = async (req, res) => {
    try{
        const data = await api.getSubreddit('wallstreetbets').getHot({
            limit: 15
        }) ;

        const filtered_posts = data.filter( post => !post.pinned && !excludedTags.includes(post.link_flair_text) ).slice(0, 10) ;
        res.status(200).json({
            code: 200,
            reddit: {
                data: filtered_posts
            }
        }) ;
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            code: 500,
            message: 'Error occurred at server side. Please try again later.'
        }) ;
    }
} ;

// function to fetch 10 posts from r/investing with some filters
const FetchPostsOnInvesting = async (req, res) => {
    try{
        const data = await api.getSubreddit('investing').getHot({
            limit: 15
        }) ;

        const filtered_posts = data.filter( post => !post.pinned && !excludedTags.includes(post.link_flair_text) ).slice(2, 12) ;
        res.status(200).json({
            code: 200,
            reddit: {
                data: filtered_posts
            }
        }) ;
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            code: 500,
            message: 'Error occurred at server side. Please try again later.'
        }) ;
    }
} ;

module.exports = {
    FetchPostsOnWallStreetBets,
    FetchPostsOnInvesting
} ;