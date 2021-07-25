import mongoose from 'mongoose' ;

const metricSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    current: {
        type: String,
        required: true
    },
    difference: {
        type: String,
        required: true
    },
    percentage: {
        type: String,
        required: true
    },
    prevClose: {
        type: String,
        required: true
    },
    open: {
        type: String,
        required: true
    },
    high: {
        type: String,
        required: true
    },
    low: {
        type: String,
        required: true
    },
    negative: {
        type: Boolean,
        required: true
    }
}) ;

export const metricModel = mongoose.model('Metric', metricSchema) ;