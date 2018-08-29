var express      =require("express");
var app          =express();
var bodyParser   =require("body-parser");
var mongoose     =require("mongoose");
var methodOverride=require("method-override");
var User          =require("./models/user");
var Poll          =require("./models/poll")
var passport      =require("passport");
var LocalStrategy         = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var seedDB=                 require("./seeds");
app.use(express.static(__dirname + "/public"));
// mongoose.connect("mongodb://localhost/vtapp");
mongoose.connect("mongodb://varun560:vj20211999@ds135952.mlab.com:35952/vtappjs")
seedDB();
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(require("express-session")({
    secret: "sdc",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});



function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.get("/",function(req,res){
    Poll.find({},function(err,allpolls){
       if(err){
           console.log(err);
       }
       else
       {
              res.render("landing",{polls:allpolls}); 
       }
    });
    
 
});
app.post("/",isLoggedIn,function(req,res){
    var name=req.body.name;
    var text=req.body.options;
    var arrops=text.split("\n");
    var newpoll={name:name,options:[]};
    arrops.forEach(function(opt){
        newpoll.options.push({key:opt,userlist:[]});
    });
    Poll.create(newpoll,function(err,newp){
        if(err){
            console.log(err);
        }
        else {
             res.redirect("/");
        }
        
        
    });
   
    
});
app.get("/new",isLoggedIn,function(req,res){
    res.render("new");
    
});
app.get("/pollshow/:id/edit",function(req,res){
    Poll.findById(req.params.id,function(err,foundpoll){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{poll:foundpoll});
        }
        
    });
});



app.put("/pollshow/:id",isLoggedIn,function(req,res){
    Poll.findById(req.params.id,function(err,found){
        if(err){
            console.log(err);
            
        }
        else{
            if(found.votelist.indexOf(req.user._id)==-1)
            {found.options.forEach(function(option){
                 if(option.key==req.body.choice){
                option.userlist.push(req.user._id);
                found.votelist.push(req.user._id);
                found.save(function(err){
                    if(err){console.log(err);}
                });
                 }
                 });
        res.redirect("/pollshow/"+req.params.id+'/edit');}
        else{
            res.redirect("/");
        }
        }
     
    });
});





app.get("/register", function(req, res){
   res.render("register"); 
});
//handling user sign up
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/");
        });
    });
});

// LOGIN ROUTES
//render login form
app.get("/login", function(req, res){
   res.render("login"); 
});
//login logic
//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}) ,function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Application is running");
});