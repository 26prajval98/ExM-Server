var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var expSchema = new Schema({
    item:{
        type: String,
        required: true
    },
    price :{
        type : Number,
        required : true
    },
    latitude : {
        type: Number,
    },
    longitude : {
        type: Number,
    }
},{
    timestamps:true
});

var exp = new Schema({
    expList : [expSchema],
    uid :  {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required : true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('exp', exp);