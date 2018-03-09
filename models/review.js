var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reviewSchema = new Schema({
    ratings :{
        type: Number,
        required: true
    },
    review :{
        type : String,
        required : true
    },
    uid : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required : true
    }
},{
    timestamps : true
});

var Review = mongoose.model('Reviews', reviewSchema);

module.exports = Review;