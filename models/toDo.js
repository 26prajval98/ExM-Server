var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var toDoSchema = new Schema({
    item:{
        type: String,
        required: true
    },
    uid :  {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required : true
    }

},{
    timestamps:true
});
toDoSchema.index({createdAt: 2},{expireAfterSeconds: 24*3600});
var ToDos = mongoose.model('toDo', toDoSchema);

module.exports = ToDos;