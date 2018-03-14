var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var savingsSchema = new Schema({
    weekNo : {
        type: Number,
        required: true
    },
    saved : {
        type: Number,
        required:true
    }
},{
    timestamps:true
});

var savingsListSchema = new Schema({
    savingsList : [savingsSchema],
    savings:{
        type: Number,
        default: 0
    },
    boughtFromSavings : {
        type: Number,
        default: 0
    },
    uid :  {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required : true
    }
},{
    timestamps: true
})

var savings = mongoose.model('savings', savingsListSchema);

module.exports = savings;