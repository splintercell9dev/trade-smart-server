const express = require('express') ;
const { FetchPostsOnWallStreetBets, FetchPostsOnInvesting } = require('../controllers/reddit');
const router = express.Router() ;

router.get('/wallstreetbets', FetchPostsOnWallStreetBets) ;
router.get('/investing', FetchPostsOnInvesting) ;

module.exports = router ;