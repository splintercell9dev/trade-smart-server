const express = require('express') ;
const router = express.Router() ;

const { FetchPostsForSocialFeed, FetchCompanyPostFeed } = require('../controllers/twitter') ;

router.get('/people/posts', FetchPostsForSocialFeed) ;
router.get('/company/posts', FetchCompanyPostFeed) ;

module.exports = router ;