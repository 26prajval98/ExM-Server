var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');
var multer = require('multer'); 
var path = require('path');
var fs = require('fs');

var authenticate = require('../authenticate');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

var storage = multer.diskStorage({
    destination :(req, file, cb)=>{
        cb(null,'public/images');
    }, 
    filename:  (req, file, cb)=>{
        cb(null, req.user.username+'.PNG');
    }
})

var imageFileFilter = (req, file, cb)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|PNG|JPG|JPEG|GIF)$/)){
        return cb(new Error('Only Image file'), false);
    }
    return cb(null, true);
};

var upload =  multer({storage: storage, fileFilter: imageFileFilter});


router.post('/', authenticate.verifyUser, upload.single('imageFile'), (req, res, next)=>{
    res.statusCode =200;
    res.setHeader('Content-type', 'application/json');
    res.json({success:true});
})

router.get('/',(req,res,next)=>{
    res.sendFile(path.join(__dirname, '../public/images/userPH.png'));
})

router.get('/:id',(req,res,next)=>{
    if(fs.existsSync(path.join(__dirname, '../public/images',req.params.id))){
        res.sendFile(path.join(__dirname, '../public/images',req.params.id));
    }
    else{
        res.sendFile(path.join(__dirname, '../public/images/userPH.png'));
    }
})

module.exports = router;