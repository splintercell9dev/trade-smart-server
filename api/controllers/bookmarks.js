// controller for bookmarks route

const logger = require('../utils/logger') ;
const { CustomException } = require('../utils/functions') ;
const FullList = require('../json/full_company_list.json') ;
const CompanyModel = require('../models/CompanyModel') ;

const FetchBookmarks = async (req, res) => {
    let allSymbolsOk = true ;
    try{
        const reqArray = JSON.parse(req.query.array) ;

        console.log(typeof reqArray) ;

        if (reqArray === '' || reqArray === undefined || !reqArray.length){
            throw CustomException('Requested query is invalid. Please enter valid query!', 'invalid') ;
        }
        
        for(let sym of reqArray){
            if (!FullList.some(company => company.symbol === sym)){
                allSymbolsOk = false ;
                break ;
            }
        }

        if (allSymbolsOk){
            const searchBookmarks = await CompanyModel.find({
                symbol: {
                    $in: reqArray
                }
            }) ;

            const final_data = searchBookmarks.map(company => {
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
        else{
            throw CustomException('Query array includes invalid symbol.', 'invalid') ;
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
    FetchBookmarks
} ;