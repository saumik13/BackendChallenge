//AUTH ROUTES
let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/user");



//GET request to access the landing page
router.get("/", function (req, res) {
    res.render("landing");

});


//GET request for the registration form
router.get("/register", function (req,res) {
    res.render("register")

});

//When the registration form is submitted and user info is uploaded to mongoDB
router.post("/register", function (req,res) {
    console.log("This point has been reached");
    User.register(new User({username: req.body.username}), req.body.password, function (err,user) {
        if(err){

            return res.render("register");
        }
        passport.authenticate("local")(req,res,function () {
            res.redirect("/images");

        })


    })

});

//GET request to access login page
router.get("/login", function (req,res) {
    res.render("login");

});

router.post('/login', passport.authenticate("local",{
    successRedirect: "/images",
    failureRedirect: "/login"

}),function (req,res) {


});
//LOGOUT

router.get("/logout", function (req,res) {
    req.logout();
    res.redirect("/");

});


function isLoggedIn(req,res, next){
    if (req.isAuthenticated()){
        return next();
    }

    res.redirect("/login");

}

module.exports = router;