var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var toBuySchema = new Schema({
    item:{
        type: String,
        required: true
    },
    price :{
        type : Number,
        required : true
    },
    purchased:{
        type: Boolean,
        default: false
    }
},{
    timestamps:true
});

var toBuyListSchema = new Schema({
    toBuy : [toBuySchema],
    uid :  {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required : true
    }
},{
    timestamps: true
})

var ToBuy = mongoose.model('ToBuy', toBuyListSchema);

module.exports = ToBuy;