
let Image = require("../models/image");

//checking if the user is logged in
function isLoggedIn(req,res, next){
    if (req.isAuthenticated()){
        return next();
    }

    res.redirect("/login");

};


//this function checks if the user that is signed in is the same as the user who uploaded the imahe
//it is called as a middleware when an image is being deleted
function checkImageOwnership(req,res,next){
    if(req.isAuthenticated()){
        Image.findById(req.params.id, function (err,foundCampground) {
            if(err){
                console.log("There is an error");
                res.redirect("back");

            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    console.log("Unauthorized person trying to enter;");
                    res.redirect("back");
                }

            }

        })

    }else{
        res.redirect("back");
        console.log("ALIEN ATTEMPTING TO ENTER");
    }

}

module.exports = {isLoggedIn,checkImageOwnership};