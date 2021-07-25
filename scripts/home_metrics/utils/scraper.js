import cheerio from 'cheerio' ;
import { NSE_SELECTOR, NSE_TABLE } from './data.js' ;

function getNSEMetric(selector, $, returnTextOnly = true, filterNegative = false){
    if (returnTextOnly){
        return $(selector).text().trim() ;
    }
    else if (filterNegative){
        return $(selector).text().trim().replace('-', '').replace(',', '') ;
    }
    else{
        return $(selector).text().trim().replace(',', '') ;
    }
}

function getBSEMetric(selector, $, getNormalString = false, diff = false){
    if (getNormalString){
        return $(selector).text().trim().replace(',' , '') ;
    }
    else if (diff){
        return {
            diff: $(selector).text().split(' ')[0].replace(',', '').replace('-', ''),
            perc: $(selector).text().split(' ')[1].replace(',', '').replace('-', ''),
        }
    }
    else {
        return $(selector).text().split(': ')[1].trim().replace(',', '') ;
    }
}

export function getScrapedDATA(nse, bse){
    const $nse = cheerio.load(nse) ;
    const $bse = cheerio.load(bse) ;

    const final_data = [] ;
    
    for( let row of NSE_TABLE ){
        const metricObject = {
            name: getNSEMetric(NSE_SELECTOR(row, 1), $nse),
            current: getNSEMetric(NSE_SELECTOR(row, 2), $nse, false),
            percentage: getNSEMetric(NSE_SELECTOR(row, 3), $nse, false, true),
            open: getNSEMetric(NSE_SELECTOR(row, 4), $nse, false),
            high: getNSEMetric(NSE_SELECTOR(row, 5), $nse, false),
            low: getNSEMetric(NSE_SELECTOR(row, 6), $nse, false),
            prevClose: getNSEMetric(NSE_SELECTOR(row, 7), $nse, false),
            difference: Math.abs(parseFloat(getNSEMetric(NSE_SELECTOR(row, 7), $nse, false)) - parseFloat(getNSEMetric(NSE_SELECTOR(row, 2), $nse, false))).toFixed(2),
            negative: getNSEMetric(NSE_SELECTOR(row, 3), $nse, true).includes('-') ? true : false
        } ;

        final_data.push(metricObject) ;
    }

    const { diff, perc } = getBSEMetric('#idchg', $bse, false, true) ;

    const bse_sensex = {
        name: 'BSE SENSEX',
        current: getBSEMetric('#idcrval', $bse, true),
        difference: diff,
        percentage: perc,
        prevClose: getBSEMetric($bse('div.col-lg-3:not(.mobipadd)')[0], $bse),
        open: getBSEMetric($bse('div.col-lg-3:not(.mobipadd)')[1], $bse),
        high: getBSEMetric($bse('div.col-lg-3:not(.mobipadd)')[2], $bse),
        low: getBSEMetric($bse('div.col-lg-3:not(.mobipadd)')[3], $bse),
        negative: getBSEMetric('#idchg', $bse, true).includes('-') ? true : false
    } ;

    final_data.unshift(bse_sensex) ;

    return final_data ;
}