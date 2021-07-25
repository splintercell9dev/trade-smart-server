import { BSE_URL, NSE_URL, USER_AGENT } from './utils/data.js' ;
import fs from 'fs' ;
import pupeteer from 'puppeteer' ;
import { getScrapedDATA } from './utils/scraper.js' ;
import mongoose from 'mongoose' ;
import { metricModel } from './models/metrics.js' ;

mongoose.connect('mongodb://localhost:27017/trade-smart', {
    useNewUrlParser: true
}, () => {
    console.log('connected to mongodb');
    (async() => {
        try{
            console.time('Chrome') ;
            console.time('start') ;
            const browser = await pupeteer.launch({
                headless: true
            }) ;
            // console.log(await browser.userAgent())
            const nse = await browser.newPage() ;
            await nse.setUserAgent(USER_AGENT) ;
            const bse = await browser.newPage() ;
            await bse.setUserAgent(USER_AGENT) ;
    
            await nse.goto(NSE_URL, {
                waitUntil: 'domcontentloaded'
            }) ;
    
            await bse.goto(BSE_URL, {
                waitUntil: 'load'
            }) ;
    
            const nseHTML = await nse.content() ;
            const bseHTML = await bse.content() ;
    
            const final_data = getScrapedDATA(nseHTML, bseHTML) ;
    
            const metrics = new metricModel(final_data) ;
            
    
            console.timeEnd('start') ;
    
            await browser.close() ;
            console.timeEnd('Chrome') ;
        }
        catch(err){
            console.log(err.message);
        }
    })() ;
}) ;

// (async() => {
//     try{
//         console.time('Chrome') ;
//         console.time('start') ;
//         const browser = await pupeteer.launch({
//             headless: true
//         }) ;
//         // console.log(await browser.userAgent())
//         const nse = await browser.newPage() ;
//         await nse.setUserAgent(USER_AGENT) ;
//         const bse = await browser.newPage() ;
//         await bse.setUserAgent(USER_AGENT) ;

//         await nse.goto(NSE_URL, {
//             waitUntil: 'domcontentloaded'
//         }) ;

//         await bse.goto(BSE_URL, {
//             waitUntil: 'load'
//         }) ;

//         const nseHTML = await nse.content() ;
//         const bseHTML = await bse.content() ;

//         // await nse.screenshot({
//         //     path: 'nse.png'
//         // }) ;

//         // await bse.screenshot({
//         //     path: 'bse.png'
//         // }) ;

//         const final_data = getScrapedDATA(nseHTML, bseHTML) ;

//         // console.log(final_data);
//         fs.writeFileSync('./metrics.json', prettier.format(JSON.stringify(final_data), {
//             semi: false,
//             parser: 'json'
//         })) ;

//         console.timeEnd('start') ;

//         await browser.close() ;
//         console.timeEnd('Chrome') ;
//     }
//     catch(err){
//         console.log(err.message);
//     }
// })() ;
