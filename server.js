/*********************************************************************************
* WEB322 – Assignment 02
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students. *
* Name: Ivan Anferov Student ID: 130909195 Date: __________________ *
* Online (Heroku, https://...) Link: ___________________________________________________ *
* GitHub or Bitbucket repo Link: ___________________________________________________
* ********************************************************************************/
var path = require("path");
var express = require("express");
const multer = require("multer");
var app = express();
const exphbs = require('express-handlebars');
const dataService = require('./meals_packeges')
var nodemailer = require('nodemailer');

var HTTP_PORT = process.env.PORT || 8080;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const { check, validationResult } = require('express-validator');

app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
app.set('view engine', '.hbs');
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function(req,res){
    res.sendFile(path.join(__dirname,"/views/home.html"));
});

app.post("/register",[check('firstname','First mame is required').not().isEmpty(), check('lastname').not().isEmpty().withMessage('Last name is required'), check('email', 'Email is required').not().isEmpty(), check('password', 'Password is required').not().isEmpty(), check('password', 'Lenght must be more then 6 symbols').isLength({ min: 6 }), check('firstname', 'Lenght must be more then 2 symbols').isLength({ min: 2 })], (req, res)=>{
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let email = req.body.email;
  var errors = validationResult(req);
  var data = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  }
  if (!errors.isEmpty()) {
      return res.render("registration",{errors: errors.mapped(), success: false, data: data})

  } else {
    var mailOptions = {
      from: 'ivananer623@gmail.com',
      to: email,
      subject: 'Papa Jones',
      text: 'Welcome to Papa Jones!!!'
    };
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
      return res.render("welcome",{errors: null, success: true, data: req.body.firstname})

  }




});
app.post("/login",[check('email', 'Email is required').not().isEmpty(), check('password', 'Password is required').not().isEmpty(), check('password', 'Lenght must be more then 6 symbols').isLength({ min: 6 })], (req, res)=>{

  var errors = validationResult(req);
  var data = {
    email: req.body.email
  }
  if (!errors.isEmpty()) {

    return res.render("login",{errors: errors.mapped(), success: false, data: data})


  } else {

    return res.render("welcome",{errors: null, success: true, data: req.body.firstname})

  }
  let email = req.body.email;

});

app.get("/packages", function(req,res){
  return res.render("packages", {
    data: dataService.getMeals(),
  })
})

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ivananer623@gmail.com',
    pass: '12345qweR'
  }
});





app.get('/welcome', function(req,res){
  res.send("LOOOL")
})

app.get("/meals", function(req,res){
    res.send('meals');
});

app.get("/registration", function(req,res){
  res.render('registration');

});
app.get("/login", function(req,res){
  res.render('login');

});


app.use(express.static("media"));

app.get('/script.js',function(req,res){
    res.sendFile(path.join(__dirname + '/script.js'));
});
app.get('/top_meal_packeges.js',function(req,res){
    res.sendFile(path.join(__dirname + '/top_meal_packeges.js'));
});
app.get('/meals_packeges.js',function(req,res){
    res.sendFile(path.join(__dirname + '/meals_packeges.js'));
});

app.listen(HTTP_PORT, onHttpStart);
