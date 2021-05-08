# ImageRepository
This is an image repository where you can upload images, view images uploaded by other users and also delete the images that you uploaded. 


## Demo 
![Alt Text](https://github.com/saumik13/ImageRepository/blob/master/demoDeleteBrowse.gif)

### How to use it
The application is up and running. Just visit [ImageRepo](https://shopify-backend-imagerepo.herokuapp.com/) , make an account and start uploading pictures!

### Tech/framework used: 
* NodeJS 
* Express - *backend server framework*
* MongoDB (and Mongoose) - *to store user and image data*
* Passport - *nodejs middleware for user authentication*

### Code Example 
When a POST request is sent from the upload form, the image and its relevant information is stored as`obj`, according to the Schema defined before, in a MongoDB server. 
```javascript
router.post("/", [middleware.isLoggedIn, upload.single('image')], function (req,res) {

        let obj = {
        name: req.body.name,
        price : req.body.price,
        descr: req.body.description,
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
```
In MondoDB, the object, obj for a particular image can be seen as follows: 
```javascript
  {
    img: { data: [Binary], contentType: 'image/png' },
    author: { id: 5ffb8594b8f5b2af9ea25203, username: 'saumik13' },
    _id: 6000e5009607225aca72528f,
    name: 'Niagara Falls',
    price: '23.99',
    __v: 0
  }
```
The middleware `isLoggedIn` is used to check if an user is signed in before the user can view the image gallery or upload new images. 

```javascript
function isLoggedIn(req,res, next){
    if (req.isAuthenticated()){
        return next();
    }

    res.redirect("/login");

}
```
Most of the work on user authentication is done by the exported NodeJS middleware, Passport. 
```javascript
 passport.authenticate("local")(req,res,function () {
            res.redirect("/images");

        })
        
 ```
 The delete button is rendered only when the signed-in user is the same as the user who uploaded the picture. 
 When a DELETE request is sent, the ID of the image is searched in the database and then deleted after the uploader of the image is verified again using the middleware `checkImageOwnership`. 
 ```javascript 
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
```
 

