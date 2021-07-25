import cheerio from 'cheerio' ;

export const NSE_URL = 'https://www1.nseindia.com/live_market/dynaContent/live_watch/live_index_watch.htm' ;
export const BSE_URL = 'https://www.bseindia.com/sensex/code/16/' ;
export const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36' ;
export const NSE_TABLE = [
    3,
    5,
    17,
    18,
    21,
    24
] ;
export function NSE_SELECTOR(row, column){
    return `#liveIndexWatch > tbody > tr:nth-child(${row}) > td:nth-child(${column})`
}
