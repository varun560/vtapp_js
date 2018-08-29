var mongoose=require("mongoose");
var Poll=require("./models/poll");
var data = 
   [{name:"first",options:[{key:"a",userlist:[]},{key:"b",userlist:[]}]},
{name:"second",options:[{key:"a",userlist:[]},{key:"b",userlist:[]}]},
{name:"third",options:[{key:"a",userlist:[]},{key:"b",userlist:[]}]},
{name:"fourth",options:[{key:"a",userlist:[]},{key:"b",userlist:[]}]}

] 
function seedDB(){
   
   Poll.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed entries!");
        
            data.forEach(function(seed){
                Poll.create(seed, function(err, poll){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a poll");
                       
                        poll.save();
                    };
                });
            });
        });
    
}
 
module.exports = seedDB;
