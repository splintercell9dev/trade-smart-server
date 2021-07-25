const vader = require('vader-sentiment') ;
const input = 'raj is a good boy' ;

const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input) ;

console.log(intensity);