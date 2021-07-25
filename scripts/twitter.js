
const axios = require('axios').default ;
const fs = require('fs') ;
require('dotenv/config') ;
const list = require('../api/json/full_company_list.json') ;

const Twitter = axios.create({
    baseURL: 'https://api.twitter.com/2/',
    headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
    }
}) ;
const { twitter_usernames } = require('./static') ;
const companies = require('../api/json/companies_tweethandles.json') ;

(async () => {
    try{
        // const data = await axios.all(
        //     twiiter_usernames.map( username => {
        //         return Twitter.get(`/users/by/username/${username}`) ;
        //     })
        // ) ;
        // data.forEach(username => {
        //     console.log(username.data);
        // })
        // const username_string = twitter_usernames.join() ;
        // const data = await Twitter.get('/users/by', {
        //     params: {
        //         usernames: username_string,
        //         'user.fields': 'profile_image_url,verified'

        //     }
        // }) ;
        // for(let people of list){
        //     const result = await Twitter.get(`/users/${people.id}/tweets`, {
        //         params: {
        //             max_results: 5,
        //             expansions: 'attachments.media_keys',
        //             'tweet.fields': 'attachments,created_at,public_metrics',
        //             'media.fields': 'preview_image_url,url'
        //         }
        //     }) ;

        //     const full_postdata = {
        //         ...people,
        //         tweets: {
        //             data: result.data.data
        //         }
        //     } ;

        //     if (result.data.includes !== undefined){
        //         full_postdata.tweets.includes = result.data.includes ;
        //     }

        //     posts.twitter.push(full_postdata) ;
        // }

        // fs.writeFileSync('posts.json', JSON.stringify(posts)) ;
        // fs.writeFileSync('people.json', JSON.stringify(data.data))
        let final_data = [] ;

        for(let company of companies){
            let companyDetail = {
                name: company.name,
                symbol: company.symbol,
                YFSymbol: company.symbol,
                twitter: null,
                profileImageUrl: ''
            } ;
            await new Promise(res => {
                setTimeout(() => res(), 200) ;
            })
            if (company.twitterhandle !== null){
                const result = await Twitter.get(`/users/by/username/${company.twitterhandle}`, {
                    params: {
                        'user.fields': 'profile_image_url,verified'
                    }
                }) ;
    
                companyDetail = {
                    ...companyDetail,
                    twitter: {
                        id: result.data.data.id,
                        name: result.data.data.name,
                        username: result.data.data.username,
                        verified: result.data.data.verified
                    },
                    profileImageUrl: result.data.data.profile_image_url 
                } ;
            }

            final_data.push(companyDetail) ;
        }

        fs.writeFileSync('full_company_list.json', JSON.stringify(final_data)) ;
    }
    catch(err){
        console.error(err);
    }
})() ;