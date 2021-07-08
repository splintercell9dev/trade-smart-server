// fetching lates data for particular bookmarks

const express = require('express') ;
const router = express.Router() ;

const { FetchBookmarks } = require('../controllers/bookmarks') ;

router.get('/', FetchBookmarks) ;

module.exports = router ;