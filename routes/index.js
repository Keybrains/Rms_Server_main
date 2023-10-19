var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/uploadfile', function(req, res, next)
 {
  var fs = require('fs');
 
var dir = 'vaibhav/';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    console.log("abc" );
}
console.log("abcd" );
  res.render('index', { title: 'Ok' });
});

module.exports = router;
