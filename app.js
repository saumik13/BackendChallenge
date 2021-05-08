let express =       require("express");
let app =           express();
let bodyParser =    require("body-parser");
let mongoose =      require("mongoose");
let Image =    require("./models/image.js");

let User       =    require("./models/user");

//Packages imported for web authentication
let passport   =    require("passport");
let LocalStrategy = require("passport-local");

let multer = require("multer");



let indexRoutes = require("./api-routes/index");
let imageRoutes = require("./api-routes/image");



let methodOverride = require("method-override");
app.use(methodOverride("_method"));

mongoose.connect("mongodb+srv://saumik:i1O9OeZqJc6nCpxd@khabar.mjp1u.mongodb.net/khabarkoi?retryWrites=true&w=majority");



app.use(express.static(__dirname+"/public"));

//PASSPORT CONFIGURATION
app.use(require("express-session")(

    {   secret: "This is for Shopify's Backend Challenge",
        resave: false,
        saveUninitialized: false
    }

));
//Make sure app is using passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(bodyParser.urlencoded({extended: true}));

//EJS is used for the tamplating engine
app.set("view engine", "ejs");


//A middleware to extract the currentUser
app.use(function (req,res,next) {
    res.locals.currentUser = req.user;


    console.log("it is in /app.js");
    console.log(req.user);
    next() ;

});



app.use("/images",imageRoutes);
app.use("/",indexRoutes);



let port = process.env.PORT ||3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});