// fetching news from NEWSAPI.ORG

const express = require('express') ;
const router = express.Router() ;

const { FetchAllNews, FetchAllNewsRelatedToCompany } = require('../controllers/news') ;

router.get('/all', FetchAllNews) ;
router.get('/company', FetchAllNewsRelatedToCompany) ;

module.exports = router ;

