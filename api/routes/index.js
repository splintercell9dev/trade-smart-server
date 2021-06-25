// main routes file containing all routes as single module to be exported

const express = require('express') ;
const router = express.Router() ;

const MetricRoute = require('./metrics') ;
const NewsRoute = require('./news') ;
const RedditRoute = require('./reddit') ;
const TwitterRoute = require('./twitter') ;
const CompanyRoute = require('./company') ;

router.use('/metrics', MetricRoute) ;
router.use('/news', NewsRoute) ;
router.use('/reddit', RedditRoute) ;
router.use('/twitter', TwitterRoute) ;
router.use('/company', CompanyRoute) ;

module.exports = router ;