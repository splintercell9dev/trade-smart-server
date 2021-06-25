const express = require('express') ;
const router = express.Router() ;

const { FetchSearchResults, FetchFullCompanyDetails, FetchCompanyGraph } = require('../controllers/company') ;

router.get('/search', FetchSearchResults) ;
router.get('/fulldetails', FetchFullCompanyDetails) ;
router.get('/graph', FetchCompanyGraph) ;

module.exports = router ;