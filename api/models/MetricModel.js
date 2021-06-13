const mongoose = require('mongoose') ;

// schema object for both collections in mongoose

const StaticMetricSchema = mongoose.Schema({
    name: String,
    current: String,
    percentage: String,
    open: String,
    high: String,
    low: String,
    prevClose: String,
    difference: String,
    negative: Boolean
}) ;

const LiveMetricSchema = mongoose.Schema({
    name: String,
    data: [
        {
            time: String,
            value: Number
        }
    ]
}) ;

// model objects

const StaticMetricModel = mongoose.model('static-metrics', StaticMetricSchema) ;
const LiveMetricModel = mongoose.model('live-metrics', LiveMetricSchema) ;

module.exports = {
    StaticMetricModel,
    LiveMetricModel
} ;