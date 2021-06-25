const express = require('express') ;
const router = express.Router() ;

const { FetchPostsForSocialFeed } = require('../controllers/twitter') ;

router.get('/people/posts', FetchPostsForSocialFeed) ;
// router.get('/company/posts') ;

module.exports = router ;