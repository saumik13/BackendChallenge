let express = require("express");
let router = express.Router({mergeParams:true});
let Image  = require("../models/image");
let middleware = require("../middleware");
let fs = require('fs');
let path = require('path');
let multer = require('multer');


//Setting up multer to upload the image
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'api-routes/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
let upload = multer({ storage: storage });



//GET request to display the existing images in a grid format

router.get("/", middleware.isLoggedIn,function (req,res) {


    Image.find(function (err,images) {
        console.log("Im in image.find");
        console.log(images)

        res.render("image/images", {images:images, currentUser:req.user});



    })



})

//The image along with name and price is being uploaded to filesystem using the multer package
router.post("/", [middleware.isLoggedIn, upload.single('image')], function (req,res) {

        let obj = {
        name: req.body.name,
        price : req.body.price,
        descr: req.body.description,
        // img: req.body.image,
        author: {
        id:req.user._id,
        username:req.user.username
    },

            img: {
                data: fs.readFileSync(path.join(__dirname ,'uploads' , req.file.filename)),
                contentType: 'image/png'
            }
    }

    Image.create(obj,function (err,imageItem) {
        if(err){
            console.log("There is an error");
            console.log(err);
        }else{
            res.redirect("/images");
        }

    })


});

//GET request for the uploading image page, "/create"
router.get("/create",middleware.isLoggedIn, function (req,res) {

    res.render("image/create.ejs");


});



//If the image is sent to be deleted. Middleware "checkImageOwnership" checks if the uploader is deleting his own image
//If there is any error, user is redirected to landing page
//If image is sucesfully deleted, user will see the page refreshed without the image
router.delete("/:id", middleware.checkImageOwnership, function (req,res) {
    Image.findByIdAndRemove(req.params.id,function (err) {
        if(err){
            console.log("There is an error");
            res.redirect("/");

        }else{
            console.log("An ITEM has been DELETED succesfully");
            res.redirect("/images");
        }

    })

});




module.exports = router;
