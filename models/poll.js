var mongoose = require("mongoose");

var pollSchema=new mongoose.Schema({
    name:String,
    options:[{
        
         key:String,
         userlist:[{
             
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        
         }]
    }],
     votelist:[{
             
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        
         }]
    
});
module.exports=mongoose.model("Poll",pollSchema);