import mongoose from 'mongoose' ;
const url = 'mongodb://localhost:27017/trade-smart';

const personSchema = mongoose.Schema({
    name: String,
    age: Number
}) ;

const personModel = mongoose.model('home-metrics', personSchema) ;


mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    }, () => {
    console.log('connected to database');
    const person = new personModel({
        name: 'Harry',
        age: 34
    }) ;

    person.save().then( res => {
        mongoose.disconnect() ;
    }) ;

}) ;